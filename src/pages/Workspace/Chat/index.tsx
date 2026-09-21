import { MessageSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useChatStream } from '@/hooks/api/useChatStream'

import { ChatInput } from './components/ChatInput'
import { MessageBubble } from './components/MessageBubble'

export default function Chat() {
  const { analysisId } = useParams()
  const { messages, ask, isStreaming, activeTool } = useChatStream(analysisId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Ask about this repository"
          description='Try "How does authentication work?" or "Where is the price of an order calculated?"'
        />
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} activeTool={activeTool} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
      <ChatInput onSubmit={ask} disabled={isStreaming} />
    </div>
  )
}
