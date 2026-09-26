import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/Badge/Badge'
import { STATUS_TONE } from '@/utils/status'
import type { Analysis } from '@/types/api'

export function WorkspaceHeader({ analysis }: { analysis: Analysis }) {
  const languages = analysis.capabilities.languages ?? []

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-semibold text-text hover:text-accent">
          SourceLens
        </Link>
        <span className="text-text-dim">/</span>
        <span className="text-sm text-text-muted">
          {analysis.repository.owner}/{analysis.repository.name}
        </span>
        <a
          href={analysis.repository.url}
          target="_blank"
          rel="noreferrer"
          className="text-text-dim transition-colors hover:text-text-muted"
        >
          <ExternalLink size={13} />
        </a>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        {languages.length > 0 && <span>{languages.join(', ')}</span>}
        {typeof analysis.stats.files === 'number' && <span>{analysis.stats.files} files</span>}
        {typeof analysis.stats.symbols === 'number' && <span>{analysis.stats.symbols} symbols</span>}
        <Badge tone={STATUS_TONE[analysis.status]}>{analysis.status}</Badge>
      </div>
    </header>
  )
}
