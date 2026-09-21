import { useMutation } from '@tanstack/react-query'

import { submitRepository } from '@/services/repositories'

export function useSubmitRepository() {
  return useMutation({
    mutationFn: ({ url, ref }: { url: string; ref?: string }) => submitRepository(url, ref),
  })
}
