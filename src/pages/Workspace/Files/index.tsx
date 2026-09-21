import { FileCode2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState/EmptyState'
import { Spinner } from '@/components/Spinner/Spinner'
import { useFile, useFiles } from '@/hooks/api/useFiles'

import { CodeViewer } from './components/CodeViewer'
import { buildFileTree } from './components/fileTreeUtils'
import { FileTree } from './components/FileTree'

interface Selection {
  path: string
  fileId: string
  highlight?: { start: number; end: number }
}

export default function Files() {
  const { analysisId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: files, isLoading } = useFiles(analysisId)

  const [selected, setSelected] = useState<Selection | null>(null)
  const tree = useMemo(() => buildFileTree(files ?? []), [files])

  // A citation link lands here as ?path=&start=&end=: resolve it against the
  // file list once loaded, capture the highlight into state, then clear the
  // query string — this synchronizes with the URL an external system, so it
  // stays in an effect rather than being derived at render time.
  useEffect(() => {
    const path = searchParams.get('path')
    if (!path || !files) return
    const match = files.find((file) => file.path === path)
    if (!match) return
    const start = Number(searchParams.get('start'))
    const end = Number(searchParams.get('end'))
    setSelected({
      path: match.path,
      fileId: match.id,
      highlight: start && end ? { start, end } : undefined,
    })
    setSearchParams({}, { replace: true })
  }, [files, searchParams, setSearchParams])

  const { data: file } = useFile(analysisId, selected?.fileId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 overflow-y-auto border-r border-border bg-surface py-2">
        <FileTree
          node={tree}
          selectedPath={selected?.path}
          onSelect={(path, fileId) => setSelected({ path, fileId })}
        />
      </div>
      <div className="min-w-0 flex-1">
        {file ? (
          <CodeViewer content={file.content} language={file.language} highlight={selected?.highlight} />
        ) : (
          <EmptyState icon={FileCode2} title="Select a file" description="Browse the tree to view its source." />
        )}
      </div>
    </div>
  )
}
