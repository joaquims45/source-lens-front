import { useQuery } from '@tanstack/react-query'

import { getFile, listFiles } from '@/services/repositories'

export function useFiles(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['files', analysisId],
    queryFn: () => listFiles(analysisId as string),
    enabled: Boolean(analysisId),
  })
}

export function useFile(analysisId: string | undefined, fileId: string | undefined) {
  return useQuery({
    queryKey: ['file', analysisId, fileId],
    queryFn: () => getFile(analysisId as string, fileId as string),
    enabled: Boolean(analysisId) && Boolean(fileId),
  })
}
