import { Boxes } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState/EmptyState'

export default function Architecture() {
  return (
    <EmptyState
      icon={Boxes}
      title="Architecture intelligence is coming in Milestone 5"
      description="Component detection and the architecture graph aren't built yet — this view will visualize them with React Flow once they are."
    />
  )
}
