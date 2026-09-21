import { Route, Routes } from 'react-router-dom'

import Landing from '@/pages/Onboarding/Landing'
import Progress from '@/pages/Onboarding/Progress'

export default function OnboardingModule() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="progress/:analysisId" element={<Progress />} />
    </Routes>
  )
}
