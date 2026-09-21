import { useEffect, useState } from 'react'

import { apiUrl } from '@/hooks/api/client'
import type { StageSummary } from '@/types/api'

export type AnalysisRunStatus = 'connecting' | 'running' | 'completed' | 'failed' | 'cancelled'

interface AnalysisEventsState {
  stages: Record<string, StageSummary>
  status: AnalysisRunStatus
  error: string | null
}

interface StagePayload {
  stage: string
  status: string
  processed?: number
  total?: number | null
  unit?: string
  metadata?: Record<string, unknown>
}

/**
 * Live analysis progress over the backend's SSE stream: no client-side
 * simulation of progress, every stage transition comes straight from
 * `GET /analyses/{id}/events`.
 */
export function useAnalysisEvents(analysisId: string | undefined) {
  const [state, setState] = useState<AnalysisEventsState>({
    stages: {},
    status: 'connecting',
    error: null,
  })

  useEffect(() => {
    if (!analysisId) return
    setState({ stages: {}, status: 'connecting', error: null })
    const source = new EventSource(apiUrl(`/analyses/${analysisId}/events`))

    const applyStage = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as StagePayload
      setState((prev) => ({
        ...prev,
        status: prev.status === 'connecting' ? 'running' : prev.status,
        stages: {
          ...prev.stages,
          [payload.stage]: {
            name: payload.stage,
            status: payload.status,
            processed: payload.processed ?? 0,
            total: payload.total ?? null,
            unit: payload.unit ?? 'files',
            details: payload.metadata ?? {},
          },
        },
      }))
    }

    const finish = (status: AnalysisRunStatus) => (event: MessageEvent<string>) => {
      const payload = event.data ? (JSON.parse(event.data) as { error?: string }) : {}
      setState((prev) => ({
        ...prev,
        status,
        error: payload.error ?? null,
        // A stage still "started" when the job fails never gets its own
        // failure event, so reconcile it here for a clean final UI state.
        stages:
          status === 'failed' || status === 'cancelled'
            ? Object.fromEntries(
                Object.entries(prev.stages).map(([name, stage]) => [
                  name,
                  stage.status === 'started' ? { ...stage, status } : stage,
                ]),
              )
            : prev.stages,
      }))
      source.close()
    }

    source.addEventListener('stage.started', applyStage)
    source.addEventListener('stage.completed', applyStage)
    source.addEventListener('analysis.completed', finish('completed'))
    source.addEventListener('analysis.failed', finish('failed'))
    source.addEventListener('analysis.cancelled', finish('cancelled'))

    return () => source.close()
  }, [analysisId])

  return state
}
