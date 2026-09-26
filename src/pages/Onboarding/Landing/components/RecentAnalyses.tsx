import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/Badge/Badge'
import { Spinner } from '@/components/Spinner/Spinner'
import { useAnalyses } from '@/hooks/api/useAnalyses'
import { STATUS_TONE } from '@/utils/status'
import type { AnalysisListItem } from '@/types/api'

const IN_PROGRESS_STATUSES: AnalysisListItem['status'][] = ['queued', 'running']

export function RecentAnalyses() {
  const { data, isLoading } = useAnalyses()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-4" />
      </div>
    )
  }

  if (!data || data.length === 0) return null

  const goTo = (analysis: AnalysisListItem) => {
    if (IN_PROGRESS_STATUSES.includes(analysis.status)) {
      navigate(`/progress/${analysis.id}`)
    } else {
      navigate(`/analyses/${analysis.id}`)
    }
  }

  return (
    <div className="w-full max-w-lg space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-text-dim">
        Recently analyzed
      </p>
      <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
        {data.map((analysis) => (
          <li key={analysis.id}>
            <button
              type="button"
              onClick={() => goTo(analysis)}
              className="flex w-full items-center justify-between gap-3 bg-surface px-3 py-2 text-left text-sm transition-colors hover:bg-surface-raised"
            >
              <span className="truncate font-mono text-text">
                {analysis.repository.owner}/{analysis.repository.name}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-text-dim">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
                <Badge tone={STATUS_TONE[analysis.status]}>{analysis.status}</Badge>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
