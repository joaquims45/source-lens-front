import { useQuery } from '@tanstack/react-query'

import { listAnalyses } from '@/services/repositories'

export function useAnalyses() {
  return useQuery({ queryKey: ['analyses'], queryFn: listAnalyses })
}
