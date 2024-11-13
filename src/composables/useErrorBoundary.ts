import { ref, onErrorCaptured } from 'vue'

// This composable:
// - Creates a reactive error state using `ref`
// - Sets up error capture using Vue's `onErrorCaptured` hook
// - Provides a function to reset the error state
// - Returns both the error state and reset function for use in components

/**
 * Custom composable for handling errors in Vue components.
 * Provides error capturing and reset functionality.
 * 
 * @returns An object containing error state and reset function
 */
export function useErrorBoundary() {
  // Create a ref to store the error state
  const error = ref<Error | null>(null)

  // Capture errors that occur in child components
  onErrorCaptured((err: Error) => {
    // Store the captured error
    error.value = err
    // Return false to prevent error from propagating up
    return false 
  })

  // Function to reset the error state
  const resetError = () => {
    error.value = null
  }

  // Return error state and reset function
  return {
    error,     // Reactive error state
    resetError // Function to clear error
  }
}