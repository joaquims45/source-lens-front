import type { FileSummary } from '@/types/api'

export interface TreeNode {
  name: string
  path: string
  file?: FileSummary
  children: Map<string, TreeNode>
}

export function buildFileTree(files: FileSummary[]): TreeNode {
  const root: TreeNode = { name: '', path: '', children: new Map() }
  for (const file of files) {
    const parts = file.path.split('/')
    let node = root
    let currentPath = ''
    for (const [index, part] of parts.entries()) {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      let child = node.children.get(part)
      if (!child) {
        child = { name: part, path: currentPath, children: new Map() }
        node.children.set(part, child)
      }
      if (index === parts.length - 1) child.file = file
      node = child
    }
  }
  return root
}
