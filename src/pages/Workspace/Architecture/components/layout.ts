import type { Edge, Node } from '@xyflow/react'

import type { ArchitectureGraph, ArchitectureNodeType } from '@/types/api'

// A simple left-to-right, column-by-type layout instead of a full graph
// layout library: these graphs are small (dozens of nodes) and the columns
// already read as the PLAN's own example flow (app -> module -> controller
// -> service -> repository -> infrastructure), so a real layout algorithm
// would add a dependency without improving legibility at this scale.
const COLUMN_BY_TYPE: Record<ArchitectureNodeType, number> = {
  application: 0,
  module: 1,
  controller: 2,
  service: 3,
  worker: 3,
  authentication: 3,
  repository: 4,
  database: 5,
  cache: 5,
  queue: 5,
  external_api: 5,
  infrastructure: 5,
}

const COLUMN_WIDTH = 260
const ROW_HEIGHT = 96

export function layoutGraph(graph: ArchitectureGraph): { nodes: Node[]; edges: Edge[] } {
  const columnCounts: Record<number, number> = {}
  const nodes: Node[] = graph.nodes.map((node) => {
    const column = COLUMN_BY_TYPE[node.type] ?? 3
    const row = columnCounts[column] ?? 0
    columnCounts[column] = row + 1
    return {
      id: node.id,
      type: 'component',
      position: { x: column * COLUMN_WIDTH, y: row * ROW_HEIGHT },
      data: { node },
    }
  })

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: `${edge.source}|${edge.target}|${edge.type}`,
    source: edge.source,
    target: edge.target,
    label: edge.type,
    animated: edge.type === 'publishes' || edge.type === 'consumes',
  }))

  return { nodes, edges }
}
