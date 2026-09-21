import Editor, { type OnMount } from '@monaco-editor/react'
import { useCallback, useEffect, useRef } from 'react'

import { toMonacoLanguage } from '@/utils/language'

interface CodeViewerProps {
  content: string
  language: string
  highlight?: { start: number; end: number }
}

export function CodeViewer({ content, language, highlight }: CodeViewerProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const decorationsRef = useRef<string[]>([])

  const applyHighlight = useCallback(() => {
    const editor = editorRef.current
    if (!editor || !highlight) return
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: highlight.start,
          startColumn: 1,
          endLineNumber: highlight.end,
          endColumn: 1,
        },
        options: { isWholeLine: true, className: 'sourcelens-highlight-line' },
      },
    ])
    editor.revealLineInCenter(highlight.start)
  }, [highlight])

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor
    applyHighlight()
  }

  useEffect(() => {
    applyHighlight()
  }, [applyHighlight, content])

  return (
    <Editor
      theme="vs-dark"
      language={toMonacoLanguage(language)}
      value={content}
      onMount={handleMount}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: 'JetBrains Mono, monospace',
        scrollBeyondLastLine: false,
        renderLineHighlight: 'none',
      }}
    />
  )
}
