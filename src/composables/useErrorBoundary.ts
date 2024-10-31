import { ref, onErrorCaptured } from 'vue'

export function useErrorBoundary() {
  const error = ref<Error | null>(null)

  onErrorCaptured((err: Error) => {
    error.value = err
    return false // Prevent error from propagating
  })

  const resetError = () => {
    error.value = null
  }

  return {
    error,
    resetError
  }
}