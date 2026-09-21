import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/Button/Button'
import { useAnalysisEvents } from '@/hooks/api/useAnalysisEvents'

import { STAGE_ORDER } from './components/stageOrder'
import { StageRow } from './components/StageRow'

export default function Progress() {
  const { analysisId } = useParams()
  const navigate = useNavigate()
  const { stages, status, error } = useAnalysisEvents(analysisId)

  useEffect(() => {
    if (status === 'completed' && analysisId) {
      navigate(`/analyses/${analysisId}/chat`, { replace: true })
    }
  }, [status, analysisId, navigate])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="space-y-1 text-center">
        <h1 className="text-lg font-semibold text-text">Analyzing repository</h1>
        <p className="text-sm text-text-muted">This runs the ingestion pipeline in real time.</p>
      </div>

      <ul className="w-full max-w-xs space-y-2.5 rounded-md border border-border bg-surface p-4">
        {STAGE_ORDER.map((name) => (
          <StageRow key={name} name={name} stage={stages[name]} />
        ))}
      </ul>

      {status === 'failed' && (
        <div className="space-y-2 text-center">
          <p className="text-sm text-danger">Analysis failed{error ? `: ${error}` : '.'}</p>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Try another repository
          </Button>
        </div>
      )}
    </div>
  )
}
