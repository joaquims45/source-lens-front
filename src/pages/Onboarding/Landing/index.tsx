import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button/Button'
import { Spinner } from '@/components/Spinner/Spinner'
import { useSubmitRepository } from '@/hooks/api/useSubmitRepository'
import { ApiError } from '@/hooks/api/client'

const URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/

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
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text">SourceLens</h1>
        <p className="text-sm text-text-muted">Understand any codebase with AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-2">
        <div className="flex items-center gap-2">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
            disabled={submit.isPending}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
          />
          <Button type="submit" disabled={submit.isPending} icon={submit.isPending ? <Spinner /> : <ArrowRight size={15} />}>
            Analyze Repository
          </Button>
        </div>
        {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
      </form>
    </div>
  )
}
