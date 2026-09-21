import { Handle, Position } from '@xyflow/react'

import type { ArchitectureNode } from '@/types/api'

import { NODE_STYLE } from './nodeStyle'

export function ComponentNode({ data }: { data: { node: ArchitectureNode } }) {
  const { node } = data
  const style = NODE_STYLE[node.type]
  const Icon = style.icon

  return (
    <div
      className="w-52 rounded-md border bg-surface px-3 py-2 shadow-sm"
      style={{ borderColor: `${style.color}66` }}
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: style.color }} />
        <span className="truncate text-sm font-medium text-text">{node.label}</span>
      </div>
      <p className="mt-0.5 text-xs text-text-dim">
        {node.type} · {Math.round(node.confidence * 100)}% confidence
      </p>
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  )
}
