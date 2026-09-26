import { useQuery } from '@tanstack/react-query'

import { listConversations } from '@/services/repositories'

export function useConversations(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['conversations', analysisId],
    queryFn: () => listConversations(analysisId as string),
    enabled: Boolean(analysisId),
  })
}
