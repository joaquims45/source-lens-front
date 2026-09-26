import { History, Plus } from 'lucide-react'
import { useState } from 'react'

import { useConversations } from '@/hooks/api/useConversations'

interface ConversationHistoryProps {
  analysisId: string | undefined
  onSelect: (conversationId: string) => void
  onNewChat: () => void
}

export function ConversationHistory({ analysisId, onSelect, onNewChat }: ConversationHistoryProps) {
  const [open, setOpen] = useState(false)
  const { data } = useConversations(open ? analysisId : undefined)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
      >
        <History size={13} />
        History
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-72 rounded-md border border-border bg-surface shadow-lg">
            <button
              type="button"
              onClick={() => {
                onNewChat()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left text-sm text-text hover:bg-surface-raised"
            >
              <Plus size={14} />
              New chat
            </button>
            <div className="max-h-72 overflow-y-auto">
              {!data || data.length === 0 ? (
                <p className="px-3 py-3 text-xs text-text-dim">No past conversations yet.</p>
              ) : (
                data.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      onSelect(conversation.id)
                      setOpen(false)
                    }}
                    className="flex w-full flex-col gap-0.5 px-3 py-2 text-left hover:bg-surface-raised"
                  >
                    <span className="truncate text-sm text-text">
                      {conversation.preview ?? 'Untitled conversation'}
                    </span>
                    <span className="text-xs text-text-dim">
                      {new Date(conversation.created_at).toLocaleString()}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
