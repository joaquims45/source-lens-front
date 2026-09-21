import type { LanguageStat } from '@/types/api'
import { formatPercent } from '@/utils/format'
import { languageColor } from '@/utils/language'

export function LanguageBar({ languages }: { languages: Record<string, LanguageStat> }) {
  const totalBytes = Object.values(languages).reduce((sum, stat) => sum + stat.bytes, 0)
  const entries = Object.entries(languages).sort(([, a], [, b]) => b.bytes - a.bytes)

  return (
    <div className="space-y-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-raised">
        {entries.map(([language, stat]) => (
          <div
            key={language}
            style={{ width: formatPercent(stat.bytes, totalBytes), backgroundColor: languageColor(language) }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {entries.map(([language, stat]) => (
          <li key={language} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="size-2 rounded-full" style={{ backgroundColor: languageColor(language) }} />
            {language} <span className="text-text-dim">{formatPercent(stat.bytes, totalBytes)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
