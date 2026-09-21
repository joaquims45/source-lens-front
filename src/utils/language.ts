const MONACO_LANGUAGE_BY_BACKEND_LANGUAGE: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  tsx: 'typescript',
  json: 'json',
  yaml: 'yaml',
  toml: 'ini',
  markdown: 'markdown',
  text: 'plaintext',
}

export function toMonacoLanguage(backendLanguage: string): string {
  return MONACO_LANGUAGE_BY_BACKEND_LANGUAGE[backendLanguage] ?? 'plaintext'
}

const LANGUAGE_COLORS: Record<string, string> = {
  python: '#3572A5',
  javascript: '#f1e05a',
  typescript: '#3178c6',
  tsx: '#3178c6',
  json: '#8a8a8a',
  yaml: '#cb171e',
  toml: '#9c4221',
  markdown: '#6b7280',
  text: '#6b7280',
}

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? '#6b7280'
}
