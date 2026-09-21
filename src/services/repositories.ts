import { apiRequest } from '@/hooks/api/client'
import type {
  Analysis,
  ArchitectureComponent,
  ArchitectureGraph,
  FileDetail,
  FileSummary,
  SubmitRepositoryResponse,
} from '@/types/api'

export function submitRepository(url: string, ref?: string): Promise<SubmitRepositoryResponse> {
  return apiRequest<SubmitRepositoryResponse>('/repositories', {
    method: 'POST',
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    body: { url, ref: ref || undefined },
  })
}

export function getAnalysis(analysisId: string, signal?: AbortSignal): Promise<Analysis> {
  return apiRequest<Analysis>(`/analyses/${analysisId}`, { signal })
}

export function listFiles(analysisId: string): Promise<FileSummary[]> {
  return apiRequest<FileSummary[]>(`/analyses/${analysisId}/files`)
}

export function getFile(analysisId: string, fileId: string): Promise<FileDetail> {
  return apiRequest<FileDetail>(`/analyses/${analysisId}/files/${fileId}`)
}

export function getArchitecture(analysisId: string): Promise<ArchitectureGraph> {
  return apiRequest<ArchitectureGraph>(`/analyses/${analysisId}/architecture`)
}

export function getArchitectureComponent(
  analysisId: string,
  componentId: string,
): Promise<ArchitectureComponent> {
  return apiRequest<ArchitectureComponent>(
    `/analyses/${analysisId}/architecture/components/${encodeURIComponent(componentId)}`,
  )
}
