import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Spinner } from '@/components/Spinner/Spinner'

const OnboardingModule = lazy(() => import('@/modules/onboarding'))
const WorkspaceModule = lazy(() => import('@/modules/workspace'))

function ModuleFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="size-5" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<ModuleFallback />}>
      <Routes>
        <Route path="/*" element={<OnboardingModule />} />
        <Route path="/analyses/:analysisId/*" element={<WorkspaceModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
