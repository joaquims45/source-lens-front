import { Check, CircleDashed, X } from 'lucide-react'

import { Spinner } from '@/components/Spinner/Spinner'
import type { StageSummary } from '@/types/api'
import { cn } from '@/utils/cn'

const STAGE_LABELS: Record<string, string> = {
  clone: 'Repository cloned',
  discovery: 'Files discovered',
  languages: 'Languages detected',
  parsing: 'Symbols extracted',
  embedding: 'Embeddings generated',
}

export function StageRow({ stage, name }: { stage: StageSummary | undefined; name: string }) {
  const status = stage?.status ?? 'pending'
  const label = STAGE_LABELS[name] ?? name

  return (
    <li className="flex items-center gap-2.5 text-sm">
      {status === 'completed' && <Check size={15} className="text-success" />}
      {status === 'failed' && <X size={15} className="text-danger" />}
      {status === 'started' && <Spinner />}
      {status === 'pending' && <CircleDashed size={15} className="text-text-dim" />}
      <span className={cn(status === 'pending' ? 'text-text-dim' : 'text-text')}>{label}</span>
      {stage && typeof stage.total === 'number' && status === 'started' && (
        <span className="text-xs text-text-dim">
          {stage.processed}/{stage.total}
        </span>
      )}
      {name === 'discovery' && stage?.status === 'completed' && typeof stage.total === 'number' && (
        <span className="text-xs text-text-dim">{stage.total} files</span>
      )}
    </li>
  )
}
