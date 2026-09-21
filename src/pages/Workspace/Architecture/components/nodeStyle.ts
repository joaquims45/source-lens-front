import {
  Boxes,
  Cloud,
  Cpu,
  Database,
  Globe,
  KeyRound,
  type LucideIcon,
  MessageSquareShare,
  PanelsTopLeft,
  Package,
  Server,
  Zap,
} from 'lucide-react'

import type { ArchitectureNodeType } from '@/types/api'

interface NodeStyle {
  icon: LucideIcon
  color: string
}

export const NODE_STYLE: Record<ArchitectureNodeType, NodeStyle> = {
  application: { icon: PanelsTopLeft, color: '#6366f1' },
  module: { icon: Package, color: '#8b8b93' },
  controller: { icon: Globe, color: '#3b82f6' },
  service: { icon: Cpu, color: '#22c55e' },
  repository: { icon: Boxes, color: '#eab308' },
  worker: { icon: Zap, color: '#f97316' },
  authentication: { icon: KeyRound, color: '#ec4899' },
  database: { icon: Database, color: '#06b6d4' },
  cache: { icon: Server, color: '#f43f5e' },
  queue: { icon: MessageSquareShare, color: '#a855f7' },
  external_api: { icon: Cloud, color: '#64748b' },
  infrastructure: { icon: Server, color: '#78716c' },
}

export const NODE_TYPE_LABEL: Record<ArchitectureNodeType, string> = {
  application: 'Application',
  module: 'Module',
  controller: 'Controller',
  service: 'Service',
  repository: 'Repository',
  worker: 'Worker',
  authentication: 'Authentication',
  database: 'Database',
  cache: 'Cache',
  queue: 'Queue',
  external_api: 'External API',
  infrastructure: 'Infrastructure',
}
