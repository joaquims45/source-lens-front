import { CitationChip } from '@/components/CitationChip/CitationChip'
import { Spinner } from '@/components/Spinner/Spinner'
import type { ChatMessage } from '@/types/api'
import { cn } from '@/utils/cn'

export function MessageBubble({ message, activeTool }: { message: ChatMessage; activeTool: string | null }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-2xl rounded-lg px-3.5 py-2 text-sm leading-relaxed',
          isUser ? 'bg-accent text-white' : 'border border-border bg-surface text-text',
        )}
      >
        {message.pending ? (
          <span className="flex items-center gap-2 text-text-muted">
            <Spinner />
            {activeTool ? `Running ${activeTool}…` : 'Thinking…'}
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {message.citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.citations.map((citation) => (
            <CitationChip key={`${citation.path}:${citation.start_line}`} citation={citation} />
          ))}
        </div>
      )}
    </div>
  )
}
