import { useQuery } from '@tanstack/react-query'

import { getSymbolTrace, searchSymbols } from '@/services/repositories'

export function useSymbolSearch(analysisId: string | undefined, query: string) {
  return useQuery({
    queryKey: ['symbol-search', analysisId, query],
    queryFn: () => searchSymbols(analysisId as string, query),
    enabled: Boolean(analysisId),
  })
}

export function useSymbolTrace(analysisId: string | undefined, symbolId: string | null) {
  return useQuery({
    queryKey: ['symbol-trace', analysisId, symbolId],
    queryFn: () => getSymbolTrace(analysisId as string, symbolId as string),
    enabled: Boolean(analysisId) && Boolean(symbolId),
  })
}
