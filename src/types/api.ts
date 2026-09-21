export interface SubmitRepositoryResponse {
  repository_id: string
  analysis_id: string
  job_id: string
  status: string
}

export interface RepositorySummary {
  id: string
  owner: string
  name: string
  url: string
}

export interface JobSummary {
  status: string
  attempt: number
  error: string | null
}

export interface StageSummary {
  name: string
  status: string
  processed: number
  total: number | null
  unit: string
  details: Record<string, unknown>
}

export interface LanguageStat {
  files: number
  bytes: number
}

export interface AnalysisStats {
  files?: number
  excluded?: number
  symbols?: number
  chunks?: number
  embedded_chunks?: number
  languages?: Record<string, LanguageStat>
  [key: string]: unknown
}

export interface AnalysisCapabilities {
  languages?: string[]
  search?: { lexical: boolean; semantic: boolean; hybrid: boolean }
  [key: string]: unknown
}

export interface Analysis {
  id: string
  repository: RepositorySummary
  requested_ref: string | null
  commit_sha: string | null
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  pipeline_version: string
  versions: Record<string, unknown>
  capabilities: AnalysisCapabilities
  stats: AnalysisStats
  created_at: string
  completed_at: string | null
  job: JobSummary | null
  stages: StageSummary[]
}

export interface FileSummary {
  id: string
  path: string
  language: string
  size_bytes: number
  parse_status: 'ok' | 'partial' | 'unsupported'
}

export interface SymbolSummary {
  id: string
  file_id: string
  file_path: string
  parent_id: string | null
  name: string
  qualified_name: string
  kind: string
  start_line: number
  end_line: number
  signature: string
  exported: boolean
}

export interface ImportSummary {
  module: string
  content: string
  start_line: number
}

export interface FileDetail {
  id: string
  path: string
  language: string
  size_bytes: number
  parse_status: string
  diagnostics: Record<string, unknown>
  content: string
  symbols: SymbolSummary[]
  imports: ImportSummary[]
}

export interface Citation {
  path: string
  start_line: number
  end_line: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations: Citation[]
  pending?: boolean
}

export type ArchitectureNodeType =
  | 'application'
  | 'module'
  | 'controller'
  | 'service'
  | 'repository'
  | 'database'
  | 'cache'
  | 'queue'
  | 'worker'
  | 'external_api'
  | 'infrastructure'
  | 'authentication'

export type ArchitectureEdgeType =
  | 'imports'
  | 'calls'
  | 'depends_on'
  | 'reads'
  | 'writes'
  | 'publishes'
  | 'consumes'
  | 'exposes'
  | 'authenticates_with'

export interface ArchitectureEvidence {
  file: string
  line: number
  reason: string
  origin: 'static' | 'heuristic' | 'llm'
}

export interface ArchitectureNode {
  id: string
  label: string
  type: ArchitectureNodeType
  confidence: number
  source_files: string[]
  metadata: Record<string, unknown>
  evidence: ArchitectureEvidence[]
}

export interface ArchitectureEdge {
  source: string
  target: string
  type: ArchitectureEdgeType
  confidence: number
  evidence: ArchitectureEvidence[]
}

export interface ArchitectureGraph {
  name: string
  schema_version: string
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
  warnings: string[]
}

export interface ArchitectureComponent {
  node: ArchitectureNode
  incoming: ArchitectureEdge[]
  outgoing: ArchitectureEdge[]
}
