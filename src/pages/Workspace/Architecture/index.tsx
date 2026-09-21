import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Boxes } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState/EmptyState'
import { Spinner } from '@/components/Spinner/Spinner'
import { useArchitecture } from '@/hooks/api/useArchitecture'
import type { ArchitectureNodeType } from '@/types/api'

import { ComponentNode } from './components/ComponentNode'
import { ComponentPanel } from './components/ComponentPanel'
import { layoutGraph } from './components/layout'
import { TypeFilter } from './components/TypeFilter'

const NODE_TYPES = { component: ComponentNode }

export default function Architecture() {
  const { analysisId } = useParams()
  const { data: graph, isLoading } = useArchitecture(analysisId)
  const [hidden, setHidden] = useState<Set<ArchitectureNodeType>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)

  const presentTypes = useMemo(
    () => Array.from(new Set(graph?.nodes.map((n) => n.type) ?? [])).sort(),
    [graph],
  )

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] }
    const filtered = {
      ...graph,
      nodes: graph.nodes.filter((n) => !hidden.has(n.type)),
    }
    const visibleIds = new Set(filtered.nodes.map((n) => n.id))
    return layoutGraph({
      ...filtered,
      edges: graph.edges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    })
  }, [graph, hidden])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (!graph || graph.nodes.length <= 1) {
    return (
      <EmptyState
        icon={Boxes}
        title="No architecture signals detected"
        description="SourceLens looks for frameworks, docker-compose services, dependency manifests and naming conventions — this repository didn't match any of them yet."
      />
    )
  }

  const toggleType = (type: ArchitectureNodeType) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      <TypeFilter types={presentTypes} hidden={hidden} onToggle={toggleType} />
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodeClick={(_, node) => setSelected(node.id)}
            onPaneClick={() => setSelected(null)}
            colorMode="dark"
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable className="!bg-surface" />
          </ReactFlow>
        </div>
        {selected && <ComponentPanel componentId={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
