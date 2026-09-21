import { FileCode2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import type { Citation } from '@/types/api'

export function CitationChip({ citation }: { citation: Citation }) {
  const navigate = useNavigate()
  const { analysisId } = useParams()

  return (
    <button
      onClick={() =>
        navigate(
          `/analyses/${analysisId}/files?path=${encodeURIComponent(citation.path)}&start=${citation.start_line}&end=${citation.end_line}`,
        )
      }
      className="inline-flex items-center gap-1 rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      <FileCode2 size={12} />
      {citation.path}:{citation.start_line}-{citation.end_line}
    </button>
  )
}
