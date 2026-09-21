import { useQuery } from '@tanstack/react-query'

import { getArchitecture, getArchitectureComponent } from '@/services/repositories'

export function useArchitecture(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['architecture', analysisId],
    queryFn: () => getArchitecture(analysisId as string),
    enabled: Boolean(analysisId),
  })
}

export function useArchitectureComponent(analysisId: string | undefined, componentId: string | null) {
  return useQuery({
    queryKey: ['architecture-component', analysisId, componentId],
    queryFn: () => getArchitectureComponent(analysisId as string, componentId as string),
    enabled: Boolean(analysisId) && Boolean(componentId),
  })
}
