import { useCallback, useState } from 'react'

import { apiUrl } from '@/hooks/api/client'
import type { ChatMessage, Citation } from '@/types/api'

interface DonePayload {
  conversation_id: string
}
interface ToolCallPayload {
  name: string
}
interface AnswerPayload {
  text: string
}
interface EvidencePayload {
  citations: Citation[]
}

/**
 * Drives the SSE chat endpoint. The stream carries validated, structured
 * blocks (a tool call, harvested evidence, the final answer, then `done`)
 * rather than raw token fragments, so state updates map directly onto
 * those events instead of accumulating text deltas.
 */
export function useChatStream(analysisId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string>()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const ask = useCallback(
    (question: string) => {
      if (!analysisId || isStreaming || !question.trim()) return

      const pendingId = crypto.randomUUID()
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: question, citations: [] },
        { id: pendingId, role: 'assistant', content: '', citations: [], pending: true },
      ])
      setIsStreaming(true)
      setActiveTool(null)

      const params = new URLSearchParams({ q: question })
      if (conversationId) params.set('conversation_id', conversationId)
      const source = new EventSource(apiUrl(`/analyses/${analysisId}/chat/stream?${params}`))

      const updatePending = (patch: Partial<ChatMessage>) => {
        setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, ...patch } : m)))
      }

      source.addEventListener('tool_call', (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as ToolCallPayload
        setActiveTool(payload.name)
      })
      source.addEventListener('evidence', (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as EvidencePayload
        updatePending({ citations: payload.citations })
      })
      source.addEventListener('answer', (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as AnswerPayload
        updatePending({ content: payload.text, pending: false })
      })
      source.addEventListener('done', (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as DonePayload
        setConversationId(payload.conversation_id)
        setActiveTool(null)
        setIsStreaming(false)
        source.close()
      })
      source.onerror = () => {
        setActiveTool(null)
        setIsStreaming(false)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? { ...m, content: m.content || 'Something went wrong answering this question.', pending: false }
              : m,
          ),
        )
        source.close()
      }
    },
    [analysisId, conversationId, isStreaming],
  )

  return { messages, ask, isStreaming, activeTool }
}
