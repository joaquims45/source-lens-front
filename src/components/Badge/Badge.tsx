import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent'
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-surface-raised text-text-muted border-border',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  accent: 'bg-accent/10 text-accent border-accent/30',
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
