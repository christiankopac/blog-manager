import { describe, expect, test, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '../toast'

describe('Toast Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  test('shows a toast with default values', () => {
    const store = useToastStore()
    store.show('Test message')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]).toEqual({
      id: expect.any(Number),
      message: 'Test message',
      type: 'info',
      duration: 5000
    })
  })

  test('removes toast after duration', async () => {
    const store = useToastStore()
    store.show('Test message', 'info', 1000)

    expect(store.toasts).toHaveLength(1)
    
    vi.advanceTimersByTime(1000)
    expect(store.toasts).toHaveLength(0)
  })

  test('shows different types of toasts', () => {
    const store = useToastStore()
    
    store.success('Success message')
    store.error('Error message')
    store.warning('Warning message')
    store.info('Info message')

    expect(store.toasts).toHaveLength(4)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[1].type).toBe('error')
    expect(store.toasts[2].type).toBe('warning')
    expect(store.toasts[3].type).toBe('info')
  })

  test('shows persistent toast', () => {
    const store = useToastStore()
    const id = store.showPersistent('Persistent message')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]).toEqual({
      id,
      message: 'Persistent message',
      type: 'info',
      duration: -1
    })

    vi.advanceTimersByTime(10000)
    expect(store.toasts).toHaveLength(1)
  })

  test('updates existing persistent toast', () => {
    const store = useToastStore()
    const id = store.showPersistent('Initial message')
    
    const updatedId = store.showPersistent('Updated message', 'warning', id)

    expect(updatedId).toBe(id)
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]).toEqual({
      id,
      message: 'Updated message',
      type: 'warning',
      duration: -1
    })
  })

  test('updates toast message', () => {
    const store = useToastStore()
    const id = store.showPersistent('Initial message')
    
    store.update(id, 'Updated message')

    expect(store.toasts[0].message).toBe('Updated message')
  })
})
