import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/utils/cn'

import type { TreeNode } from './fileTreeUtils'

interface FileTreeProps {
  node: TreeNode
  depth?: number
  selectedPath?: string
  onSelect: (path: string, fileId: string) => void
}

export function FileTree({ node, depth = 0, selectedPath, onSelect }: FileTreeProps) {
  const entries = [...node.children.values()].sort((a, b) => {
    const aIsDir = a.children.size > 0
    const bIsDir = b.children.size > 0
    if (aIsDir !== bIsDir) return aIsDir ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return (
    <ul>
      {entries.map((entry) => (
        <TreeRow key={entry.path} node={entry} depth={depth} selectedPath={selectedPath} onSelect={onSelect} />
      ))}
    </ul>
  )
}

interface TreeRowProps extends FileTreeProps {
  depth: number
}

function TreeRow({ node, depth, selectedPath, onSelect }: TreeRowProps) {
  const isDirectory = node.children.size > 0
  const [expanded, setExpanded] = useState(true)

  if (isDirectory) {
    return (
      <li>
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-sm text-text-muted hover:bg-surface-raised"
          style={{ paddingLeft: depth * 14 + 6 }}
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <Folder size={13} className="text-text-dim" />
          {node.name}
        </button>
        {expanded && <FileTree node={node} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />}
      </li>
    )
  }

  return (
    <li>
      <button
        onClick={() => node.file && onSelect(node.path, node.file.id)}
        className={cn(
          'flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-sm transition-colors',
          selectedPath === node.path ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface-raised hover:text-text',
        )}
        style={{ paddingLeft: depth * 14 + 22 }}
      >
        <File size={13} className="shrink-0 text-text-dim" />
        <span className="truncate">{node.name}</span>
      </button>
    </li>
  )
}
