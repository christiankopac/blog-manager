import { describe, expect, test } from 'vitest'
import { useFormValidation } from '../useFormValidation'
import { ref, nextTick } from 'vue'

// Tests for useFormValidation composable
describe('useFormValidation', () => {
  const createFormData = (data = {}) => ref({
    title: '',
    body: '',
    userId: '',
    ...data
  })

  // Validation logic tests
  test('validates title length', async () => {
    const formData = createFormData({ title: 'ab' })
    const { errors, touchField } = useFormValidation(formData)

    // Initially no errors (not touched)
    expect(errors.value.title).toBeUndefined()

    // Touch the field to trigger validation
    touchField('title')
    await nextTick()
    expect(errors.value.title).toBe('Title must be at least 3 characters')

    // Update to valid length
    formData.value.title = 'abc'
    touchField('title')
    await nextTick()
    expect(errors.value.title).toBeUndefined()
  })

  // Form state tests
  test('tracks form validity', async () => {
    const formData = createFormData()
    const { isValid, touchAll, setSubmitted } = useFormValidation(formData)

    // Initially valid (no validation yet)
    expect(isValid.value).toBe(true)

    // Validate all fields
    touchAll()
    setSubmitted()
    await nextTick()
    expect(isValid.value).toBe(false)

    // Set valid data
    formData.value = {
      title: 'Valid Title',
      body: 'Valid content that is long enough',
      userId: '1'
    }
    touchAll()
    await nextTick()
    expect(isValid.value).toBe(true)
  })

  // Reset functionality tests
  test('resets validation state', async () => {
    const formData = createFormData()
    const { errors, touchField, resetValidation } = useFormValidation(formData)

    // Set up error state
    touchField('title')
    await nextTick()
    expect(errors.value.title).toBe('Title is required')

    // Reset validation
    resetValidation()
    await nextTick()
    expect(errors.value.title).toBeUndefined()
  })

  // Real-time validation tests
  test('validates in real-time when fields are touched', async () => {
    const formData = createFormData()
    const { errors, touchField } = useFormValidation(formData)

    // Initially no validation
    expect(errors.value.title).toBeUndefined()

    // Touch field to start validation
    touchField('title')
    await nextTick()
    expect(errors.value.title).toBe('Title is required')

    // Update field and touch again
    formData.value.title = 'Valid Title'
    touchField('title')
    await nextTick()
    expect(errors.value.title).toBeUndefined()
  })
})
