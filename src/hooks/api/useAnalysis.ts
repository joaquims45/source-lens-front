import { useQuery } from '@tanstack/react-query'

import { getAnalysis } from '@/services/repositories'

const ACTIVE_STATUSES = new Set(['queued', 'running'])

export function useAnalysis(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: ({ signal }) => getAnalysis(analysisId as string, signal),
    enabled: Boolean(analysisId),
    // Only poll while the analysis is still in flight; once it reaches a
    // terminal status there is nothing new the backend could report.
    refetchInterval: (query) => (ACTIVE_STATUSES.has(query.state.data?.status ?? '') ? 1500 : false),
  })
}
