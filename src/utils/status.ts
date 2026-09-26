import type { Analysis } from '@/types/api'

export const STATUS_TONE: Record<Analysis['status'], 'neutral' | 'success' | 'warning' | 'danger'> = {
  queued: 'neutral',
  running: 'warning',
  completed: 'success',
  failed: 'danger',
  cancelled: 'neutral',
}
