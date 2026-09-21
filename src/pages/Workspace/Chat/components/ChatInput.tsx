import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

export function ChatInput({ onSubmit, disabled }: { onSubmit: (value: string) => void; disabled: boolean }) {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim() || disabled) return
    onSubmit(value)
    setValue('')
  }

  return (
    <div className="flex items-end gap-2 border-t border-border bg-surface p-3">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        rows={1}
        placeholder="Ask anything about this codebase..."
        className="max-h-32 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp size={16} />
      </button>
    </div>
  )
}
