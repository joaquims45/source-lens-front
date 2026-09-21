import { GitBranch } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState/EmptyState'

export default function Dependencies() {
  return (
    <EmptyState
      icon={GitBranch}
      title="Dependency tracing is coming in Milestone 6"
      description="Call graphs and 'who calls this / what does this call' tracing aren't built yet."
    />
  )
}
