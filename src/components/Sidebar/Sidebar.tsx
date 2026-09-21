import { Boxes, Files, GitBranch, MessageSquare, Sparkles } from 'lucide-react'
import { NavLink, useParams } from 'react-router-dom'

import { cn } from '@/utils/cn'

const ITEMS = [
  { to: 'chat', label: 'Chat', icon: MessageSquare },
  { to: 'architecture', label: 'Architecture', icon: Boxes },
  { to: 'dependencies', label: 'Dependencies', icon: GitBranch },
  { to: 'files', label: 'Files', icon: Files },
  { to: 'insights', label: 'Insights', icon: Sparkles },
]

export function Sidebar() {
  const { analysisId } = useParams()

  return (
    <nav className="flex w-48 shrink-0 flex-col gap-0.5 border-r border-border bg-surface p-2">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          // Absolute, not relative: these are siblings under a pathless
          // layout route, and React Router's route-relative resolution
          // would otherwise nest "files" under whichever tab is active
          // (e.g. /chat/files) instead of replacing it.
          to={`/analyses/${analysisId}/${to}`}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-surface-raised text-text'
                : 'text-text-muted hover:bg-surface-raised hover:text-text',
            )
          }
        >
          <Icon size={15} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
