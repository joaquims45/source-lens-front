import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Icon size={28} className="text-text-dim" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="text-sm font-medium text-text">{title}</p>
        {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
