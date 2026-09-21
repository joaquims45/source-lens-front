import { useWorkspaceContext } from '@/modules/workspace/useWorkspaceContext'
import type { LanguageStat } from '@/types/api'

import { LanguageBar } from './components/LanguageBar'
import { StatCard } from './components/StatCard'

export default function Insights() {
  const { analysis } = useWorkspaceContext()
  const languages = (analysis.stats.languages as Record<string, LanguageStat> | undefined) ?? {}
  const search = analysis.capabilities.search

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Files" value={analysis.stats.files ?? 0} />
          <StatCard label="Symbols" value={analysis.stats.symbols ?? 0} />
          <StatCard label="Chunks" value={analysis.stats.chunks ?? 0} />
          <StatCard label="Excluded" value={analysis.stats.excluded ?? 0} />
        </section>

        {Object.keys(languages).length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-text">Languages</h2>
            <LanguageBar languages={languages} />
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-text">Capabilities</h2>
          <div className="flex flex-wrap gap-2 text-xs text-text-muted">
            <span className="rounded border border-border bg-surface px-2 py-1">
              lexical search {search?.lexical ? 'ready' : 'not ready'}
            </span>
            <span className="rounded border border-border bg-surface px-2 py-1">
              semantic search {search?.semantic ? 'ready' : 'not ready'}
            </span>
            <span className="rounded border border-border bg-surface px-2 py-1">commit {analysis.commit_sha?.slice(0, 7) ?? 'n/a'}</span>
          </div>
        </section>
      </div>
    </div>
  )
}
