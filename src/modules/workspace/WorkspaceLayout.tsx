import { AlertTriangle } from 'lucide-react'
import { Outlet, useParams } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { Spinner } from '@/components/Spinner/Spinner'
import { WorkspaceHeader } from '@/components/WorkspaceHeader/WorkspaceHeader'
import { useAnalysis } from '@/hooks/api/useAnalysis'

export default function WorkspaceLayout() {
  const { analysisId } = useParams()
  const { data: analysis, isLoading, isError } = useAnalysis(analysisId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (isError || !analysis) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <AlertTriangle size={20} className="text-danger" />
        <p className="text-sm text-text-muted">This analysis could not be found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <WorkspaceHeader analysis={analysis} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden">
          <Outlet context={{ analysis }} />
        </main>
      </div>
    </div>
  )
}
