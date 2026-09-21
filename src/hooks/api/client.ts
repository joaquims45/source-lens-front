const API_BASE = '/api/v1'

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * Centralized fetch wrapper: builds the API URL, sets JSON headers, and
 * turns the backend's `application/problem+json` error shape into a typed
 * ApiError instead of letting every call site parse it by hand.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    let code = 'unknown_error'
    let message = `Request failed with status ${response.status}`
    try {
      const problem = (await response.json()) as { title?: string; detail?: string }
      code = problem.title ?? code
      message = problem.detail ?? message
    } catch {
      // Response body wasn't problem+json; fall back to the generic message.
    }
    throw new ApiError(response.status, code, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
