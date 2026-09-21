import { X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/Badge/Badge'
import { Spinner } from '@/components/Spinner/Spinner'
import { useArchitectureComponent } from '@/hooks/api/useArchitecture'
import type { ArchitectureEdge } from '@/types/api'

import { NODE_TYPE_LABEL } from './nodeStyle'

function EdgeRow({ edge, end }: { edge: ArchitectureEdge; end: 'source' | 'target' }) {
  return (
    <li className="rounded border border-border bg-surface-raised px-2 py-1.5 text-xs">
      <span className="font-medium text-text">{edge[end]}</span>
      <span className="text-text-dim"> — {edge.type}</span>
    </li>
  )
}

export function ComponentPanel({ componentId, onClose }: { componentId: string; onClose: () => void }) {
  const { analysisId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useArchitectureComponent(analysisId, componentId)

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-text">Component</span>
        <button onClick={onClose} className="text-text-dim hover:text-text">
          <X size={15} />
        </button>
      </div>

      {isLoading || !data ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-5 p-3">
          <div>
            <h2 className="text-sm font-semibold text-text">{data.node.label}</h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone="accent">{NODE_TYPE_LABEL[data.node.type]}</Badge>
              <span className="text-xs text-text-muted">{Math.round(data.node.confidence * 100)}% confidence</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-text-muted">Detected from</h3>
            <ul className="space-y-1">
              {data.node.evidence.map((item) => (
                <li key={`${item.file}:${item.line}:${item.reason}`}>
                  <button
                    onClick={() =>
                      navigate(
                        `/analyses/${analysisId}/files?path=${encodeURIComponent(item.file)}&start=${item.line}&end=${item.line}`,
                      )
                    }
                    className="w-full rounded border border-border bg-surface-raised px-2 py-1.5 text-left text-xs text-text-muted hover:border-accent/50 hover:text-accent"
                  >
                    <span className="font-mono">
                      {item.file}:{item.line}
                    </span>
                    <span className="block text-text-dim">{item.reason}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {data.outgoing.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-text-muted">Depends on</h3>
              <ul className="space-y-1">
                {data.outgoing.map((edge) => (
                  <EdgeRow key={`${edge.source}${edge.target}${edge.type}`} edge={edge} end="target" />
                ))}
              </ul>
            </div>
          )}

          {data.incoming.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-text-muted">Used by</h3>
              <ul className="space-y-1">
                {data.incoming.map((edge) => (
                  <EdgeRow key={`${edge.source}${edge.target}${edge.type}`} edge={edge} end="source" />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
