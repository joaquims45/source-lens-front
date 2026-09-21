import { useOutletContext } from 'react-router-dom'

import type { Analysis } from '@/types/api'

export interface WorkspaceContext {
  analysis: Analysis
}

export function useWorkspaceContext() {
  return useOutletContext<WorkspaceContext>()
}
