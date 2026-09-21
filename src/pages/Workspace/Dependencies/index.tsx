import { ArrowDown, FileCode2, GitBranch } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState/EmptyState'
import { Spinner } from '@/components/Spinner/Spinner'
import { useSymbolTrace } from '@/hooks/api/useSymbolTrace'

import { SymbolPicker } from './components/SymbolPicker'
import { TraceCard } from './components/TraceCard'

export default function Dependencies() {
  const { analysisId } = useParams()
  const navigate = useNavigate()
  const [symbolId, setSymbolId] = useState<string | null>(null)
  const { data: trace, isLoading } = useSymbolTrace(analysisId, symbolId)

  return (
    <div className="flex h-full">
      <SymbolPicker onSelect={setSymbolId} />
      <div className="min-w-0 flex-1">
        {!symbolId ? (
          <EmptyState
            icon={GitBranch}
            title="Trace a function or method"
            description='Pick one on the left to see "who calls this" and "what does this call" — a static, name-based call graph.'
          />
        ) : isLoading || !trace ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-5" />
          </div>
        ) : (
          // Three fixed rows rather than one long scrolling column: a
          // well-tested symbol can have dozens of callers, and the selected
          // symbol + "what this calls" must stay visible regardless of how
          // many caller cards there are — each row scrolls horizontally on
          // its own instead of pushing the rest of the layout down.
          <div className="grid h-full grid-rows-[1fr_auto_1fr] gap-2 overflow-hidden py-3">
            <div className="flex min-h-0 flex-col items-center gap-2 overflow-hidden">
              <p className="shrink-0 text-xs font-medium tracking-wide text-text-muted uppercase">
                {trace.callers.length > 0 ? 'Who calls this' : 'No callers found'}
              </p>
              <div className="flex min-h-0 flex-1 flex-wrap content-start justify-center gap-2 overflow-y-auto px-4">
                {trace.callers.map((edge) => (
                  <TraceCard key={`${edge.symbol.id}-${edge.line}`} edge={edge} onSelect={setSymbolId} />
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-2">
              {trace.callers.length > 0 && <ArrowDown size={16} className="text-text-dim" />}
              <div className="w-64 rounded-md border border-accent bg-surface-raised px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-text">{trace.symbol.qualified_name}</p>
                <button
                  onClick={() =>
                    navigate(
                      `/analyses/${analysisId}/files?path=${encodeURIComponent(trace.symbol.path)}&start=${trace.symbol.start_line}&end=${trace.symbol.end_line}`,
                    )
                  }
                  className="mt-1 flex items-center gap-1 text-xs text-text-muted hover:text-accent"
                >
                  <FileCode2 size={11} />
                  {trace.symbol.path}:{trace.symbol.start_line}
                </button>
              </div>
              {trace.callees.length > 0 && <ArrowDown size={16} className="text-text-dim" />}
            </div>

            <div className="flex min-h-0 flex-col items-center gap-2 overflow-hidden">
              <div className="flex min-h-0 flex-1 flex-wrap content-start justify-center gap-2 overflow-y-auto px-4">
                {trace.callees.map((edge) => (
                  <TraceCard key={`${edge.symbol.id}-${edge.line}`} edge={edge} onSelect={setSymbolId} />
                ))}
              </div>
              <p className="shrink-0 text-xs font-medium tracking-wide text-text-muted uppercase">
                {trace.callees.length > 0 ? 'What this calls' : 'Nothing resolved in this repository'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
