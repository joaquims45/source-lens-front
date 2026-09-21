import { Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useDebouncedValue } from '@/hooks/utils/useDebouncedValue'
import { useSymbolSearch } from '@/hooks/api/useSymbolTrace'

export function SymbolPicker({ onSelect }: { onSelect: (symbolId: string) => void }) {
  const { analysisId } = useParams()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query)
  const { data: symbols } = useSymbolSearch(analysisId, debounced)
  const callable = (symbols ?? []).filter((s) => s.kind === 'function' || s.kind === 'method')

  return (
    <div className="w-72 shrink-0 border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Search size={14} className="text-text-dim" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a function or method…"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-dim focus:outline-none"
        />
      </div>
      <ul className="max-h-full overflow-y-auto">
        {callable.map((symbol) => (
          <li key={symbol.id}>
            <button
              onClick={() => onSelect(symbol.id)}
              className="block w-full truncate px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-raised hover:text-text"
            >
              <span className="font-medium text-text">{symbol.qualified_name}</span>
              <span className="block truncate text-xs text-text-dim">{symbol.file_path}</span>
            </button>
          </li>
        ))}
        {callable.length === 0 && (
          <li className="px-3 py-4 text-center text-xs text-text-dim">No functions or methods found.</li>
        )}
      </ul>
    </div>
  )
}
