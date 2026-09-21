import type { ArchitectureNodeType } from '@/types/api'
import { cn } from '@/utils/cn'

import { NODE_STYLE, NODE_TYPE_LABEL } from './nodeStyle'

interface TypeFilterProps {
  types: ArchitectureNodeType[]
  hidden: Set<ArchitectureNodeType>
  onToggle: (type: ArchitectureNodeType) => void
}

export function TypeFilter({ types, hidden, onToggle }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-border bg-surface px-3 py-2">
      {types.map((type) => {
        const active = !hidden.has(type)
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              'rounded border px-2 py-0.5 text-xs transition-colors',
              active
                ? 'border-border bg-surface-raised text-text'
                : 'border-border-subtle text-text-dim opacity-60',
            )}
            style={active ? { borderColor: `${NODE_STYLE[type].color}66` } : undefined}
          >
            {NODE_TYPE_LABEL[type]}
          </button>
        )
      })}
    </div>
  )
}
