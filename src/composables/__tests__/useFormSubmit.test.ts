import { describe, expect, test, vi } from 'vitest'
import { useFormSubmit } from '../useFormSubmit'

describe('useFormSubmit', () => {
  // Mock data for testing
  const mockPayload = {
    title: 'Test Post',
    body: 'Test Content',
    userId: 1
  }

  // Test creation of new post
  test('handles successful form submission without id', async () => {
    const emit = vi.fn()
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    // Verify initial state
    expect(isSaving.value).toBe(false)

    // Submit form
    await handleSubmit(mockPayload)

    // Verify emit calls and state
    expect(emit).toHaveBeenCalledTimes(2)
    expect(emit).toHaveBeenCalledWith('save', mockPayload)
    expect(emit).toHaveBeenCalledWith('close')
    expect(isSaving.value).toBe(false)
  })

  // Test updating existing post
  test('handles successful form submission with id', async () => {
    const emit = vi.fn()
    const { handleSubmit, isSaving } = useFormSubmit(emit)
    const postId = 1

    // Submit form with ID
    await handleSubmit(mockPayload, postId)

    // Verify correct payload and modal closure
    expect(emit).toHaveBeenCalledWith('save', { ...mockPayload, id: postId })
    expect(emit).toHaveBeenCalledWith('close')
  })

  // Test loading state during submission
  test('sets isSaving during submission', async () => {
    // Mock async emit function
    const emit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 0)))
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    // Start submission and check loading state
    const submitPromise = handleSubmit(mockPayload)
    expect(isSaving.value).toBe(true)

    // Verify loading state is cleared after completion
    await submitPromise
    expect(isSaving.value).toBe(false)
  })

  // Test error handling
  test('resets isSaving even if submission fails', async () => {
    // Mock failed submission
    const emit = vi.fn().mockRejectedValue(new Error('Save failed'))
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    // Verify error is thrown and loading state is cleared
    await expect(handleSubmit(mockPayload)).rejects.toThrow('Save failed')
    expect(isSaving.value).toBe(false)
  })
})
