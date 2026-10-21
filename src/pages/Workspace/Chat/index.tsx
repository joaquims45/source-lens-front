import { MessageSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useChatStream } from '@/hooks/api/useChatStream'

import { ChatInput } from './components/ChatInput'
import { ConversationHistory } from './components/ConversationHistory'
import { MessageBubble } from './components/MessageBubble'

const SUGGESTIONS = [
  'How does authentication work?',
  'Where is the main entry point?',
  'Summarize the architecture',
]

export default function Chat() {
  const { analysisId } = useParams()
  const { messages, ask, isStreaming, activeTool, loadConversation, startNewConversation } =
    useChatStream(analysisId)
  const bottomRef = useRef<HTMLDivElement>(null)

  const stickToBottom = useRef(true)

  useEffect(() => {
    if (stickToBottom.current) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-end border-b border-border px-4 py-1.5">
        <ConversationHistory
          analysisId={analysisId}
          onSelect={loadConversation}
          onNewChat={startNewConversation}
        />
      </div>
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <EmptyState
            icon={MessageSquare}
            title="Ask about this repository"
            description="Answers are grounded in the source, with clickable citations."
          />
          <div className="flex max-w-xl flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                disabled={isStreaming}
                onClick={() => ask(question)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-text-dim hover:text-text disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          role="log"
          aria-live="polite"
          onScroll={(event) => {
            const el = event.currentTarget
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
          }}
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} activeTool={activeTool} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
      <ChatInput onSubmit={ask} disabled={isStreaming} />
    </div>
  )
}
