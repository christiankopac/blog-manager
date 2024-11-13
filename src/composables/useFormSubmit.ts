import { ref } from 'vue'

// This composable:
// - Defines interfaces for form data and emit functions
// - Creates a reactive saving state
// - Provides a submit handler that:
//   - Manages saving state
//   - Handles both new and existing posts
//   - Emits appropriate events
//   - Ensures cleanup of saving state
// - Returns both the saving state and submit handler

// Define the shape of form data
interface FormPayload {
  title: string
  body: string
  userId: number
}

// Define the emit function types for form actions
type EmitFunction = {
  (e: 'save', payload: FormPayload & { id?: number }): void // For saving form data
  (e: 'close'): void                                        // For closing the form
}

/**
 * Custom composable for handling form submissions.
 * Manages saving state and form submission logic.
 * 
 * @param emit - Function to emit events to parent component
 * @returns Object containing saving state and submit handler
 */
export function useFormSubmit(emit: EmitFunction) {
  // Create ref to track saving state
  const isSaving = ref(false)

  /**
   * Handles form submission
   * @param formPayload - The form data to be saved
   * @param postId - Optional ID for updating existing posts
   */
  const handleSubmit = async (formPayload: FormPayload, postId?: number) => {
    isSaving.value = true
    try {
      // Include postId in payload if updating existing post
      const payload = postId ? { ...formPayload, id: postId } : formPayload
      // Emit save event with payload
      await emit('save', payload)
      // Close form after successful save
      emit('close')
    } finally {
      // Reset saving state regardless of outcome
      isSaving.value = false
    }
  }

  return {
    isSaving,    // Reactive saving state
    handleSubmit // Form submission handler
  }
}

