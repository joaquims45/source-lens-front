import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button/Button'
import { Spinner } from '@/components/Spinner/Spinner'
import { useSubmitRepository } from '@/hooks/api/useSubmitRepository'
import { ApiError } from '@/hooks/api/client'

import { RecentAnalyses } from './components/RecentAnalyses'

const EXAMPLE_REPOS = ['pallets/flask', 'expressjs/express', 'tiangolo/fastapi']

const URL_PATTERN =/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/

export default function Landing() {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const navigate = useNavigate()
  const submit = useSubmitRepository()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = url.trim()
    if (!URL_PATTERN.test(trimmed)) {
      setValidationError('Expected a public GitHub repository URL, e.g. https://github.com/owner/repository')
      return
    }
    setValidationError(null)
    submit.mutate(
      { url: trimmed },
      { onSuccess: (data) => navigate(`/progress/${data.analysis_id}`) },
    )
  }

  const errorMessage =
    validationError ?? (submit.error instanceof ApiError ? submit.error.message : submit.error ? 'Something went wrong.' : null)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 overflow-y-auto bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_60%)] px-4 py-10 sm:px-6">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">SourceLens</h1>
        <p className="mx-auto max-w-md text-base text-text-muted">
          Paste a public GitHub repository and explore it through chat, architecture, dependencies
          and code, grounded in the source.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3">
        <label htmlFor="repo-url" className="sr-only">
          GitHub repository URL
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id="repo-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
            disabled={submit.isPending}
            aria-invalid={errorMessage ? true : undefined}
            className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-text placeholder:text-text-dim focus:border-accent"
          />
          <Button
            type="submit"
            disabled={submit.isPending}
            className="justify-center px-4 py-2.5"
            icon={submit.isPending ? <Spinner /> : <ArrowRight size={15} />}
          >
            Analyze Repository
          </Button>
        </div>
        {errorMessage && (
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-dim">
          <span>Try:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => setUrl(`https://github.com/${repo}`)}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-text-muted transition-colors hover:border-text-dim hover:text-text"
            >
              {repo}
            </button>
          ))}
        </div>
      </form>

      <RecentAnalyses />
    </div>
  )
}
