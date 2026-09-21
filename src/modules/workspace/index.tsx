import { Navigate, Route, Routes } from 'react-router-dom'

import Architecture from '@/pages/Workspace/Architecture'
import Chat from '@/pages/Workspace/Chat'
import Dependencies from '@/pages/Workspace/Dependencies'
import Files from '@/pages/Workspace/Files'
import Insights from '@/pages/Workspace/Insights'

import WorkspaceLayout from './WorkspaceLayout'

export default function WorkspaceModule() {
  return (
    <Routes>
      <Route element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<Chat />} />
        <Route path="files" element={<Files />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="dependencies" element={<Dependencies />} />
        <Route path="insights" element={<Insights />} />
      </Route>
    </Routes>
  )
}
