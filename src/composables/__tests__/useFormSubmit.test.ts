import { describe, expect, test, vi } from 'vitest'
import { useFormSubmit } from '../useFormSubmit'

describe('useFormSubmit', () => {
  const mockPayload = {
    title: 'Test Post',
    body: 'Test Content',
    userId: 1
  }

  test('handles successful form submission without id', async () => {
    const emit = vi.fn()
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    expect(isSaving.value).toBe(false)

    await handleSubmit(mockPayload)

    expect(emit).toHaveBeenCalledTimes(2)
    expect(emit).toHaveBeenCalledWith('save', mockPayload)
    expect(emit).toHaveBeenCalledWith('close')
    expect(isSaving.value).toBe(false)
  })

  test('handles successful form submission with id', async () => {
    const emit = vi.fn()
    const { handleSubmit, isSaving } = useFormSubmit(emit)
    const postId = 1

    await handleSubmit(mockPayload, postId)

    expect(emit).toHaveBeenCalledWith('save', { ...mockPayload, id: postId })
    expect(emit).toHaveBeenCalledWith('close')
  })

  test('sets isSaving during submission', async () => {
    const emit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 0)))
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    const submitPromise = handleSubmit(mockPayload)
    expect(isSaving.value).toBe(true)

    await submitPromise
    expect(isSaving.value).toBe(false)
  })

  test('resets isSaving even if submission fails', async () => {
    const emit = vi.fn().mockRejectedValue(new Error('Save failed'))
    const { handleSubmit, isSaving } = useFormSubmit(emit)

    await expect(handleSubmit(mockPayload)).rejects.toThrow('Save failed')
    expect(isSaving.value).toBe(false)
  })
})
