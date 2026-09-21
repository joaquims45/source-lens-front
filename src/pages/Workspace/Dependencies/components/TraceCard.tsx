import { FileCode2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/Badge/Badge'
import type { TraceEdge } from '@/types/api'
import { cn } from '@/utils/cn'

interface TraceCardProps {
  edge: TraceEdge
  onSelect: (symbolId: string) => void
}

export function TraceCard({ edge, onSelect }: TraceCardProps) {
  const navigate = useNavigate()
  const { analysisId } = useParams()

  return (
    <div
      className={cn(
        'flex w-64 flex-col gap-1 rounded-md border bg-surface px-3 py-2 text-left',
        edge.resolution === 'resolved' ? 'border-border' : 'border-warning/40',
      )}
    >
      <button onClick={() => onSelect(edge.symbol.id)} className="truncate text-sm font-medium text-text hover:text-accent">
        {edge.symbol.qualified_name}
      </button>
      <div className="flex items-center gap-1.5">
        <Badge tone={edge.resolution === 'resolved' ? 'success' : 'warning'}>
          {edge.resolution} · {Math.round(edge.confidence * 100)}%
        </Badge>
      </div>
      <button
        onClick={() =>
          navigate(
            `/analyses/${analysisId}/files?path=${encodeURIComponent(edge.symbol.path)}&start=${edge.symbol.start_line}&end=${edge.symbol.end_line}`,
          )
        }
        className="flex items-center gap-1 truncate text-xs text-text-dim hover:text-accent"
      >
        <FileCode2 size={11} />
        {edge.symbol.path}:{edge.line}
      </button>
    </div>
  )
}
