import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import ToastContainer from '../ToastContainer.vue'
import { createTestingPinia } from '@pinia/testing'
import { useToastStore } from '../../stores/toast'
import type { Toast } from '../../stores/toast'

describe('ToastContainer', () => {
  const createWrapper = (toasts: Toast[]) => {
    return mount(ToastContainer, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              toast: {
                toasts
              }
            }
          })
        ],
        stubs: {
          TransitionGroup: false
        }
      }
    })
  }

  test('renders toast with correct message and styling', () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Test message', type: 'success' }
    ])

    expect(wrapper.text()).toContain('Test message')
    expect(wrapper.find('.bg-green-100').exists()).toBe(true)
    expect(wrapper.find('.text-green-500').exists()).toBe(true)
  })

  test('renders different toast types with correct styling', () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Success', type: 'success' },
      { id: 2, message: 'Error', type: 'error' },
      { id: 3, message: 'Warning', type: 'warning' },
      { id: 4, message: 'Info', type: 'info' }
    ])

    expect(wrapper.find('.bg-green-100').exists()).toBe(true)
    expect(wrapper.find('.bg-red-100').exists()).toBe(true)
    expect(wrapper.find('.bg-yellow-100').exists()).toBe(true)
    expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
  })

  test('displays correct icons for different toast types', () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Success', type: 'success' },
      { id: 2, message: 'Error', type: 'error' },
      { id: 3, message: 'Warning', type: 'warning' },
      { id: 4, message: 'Info', type: 'info' }
    ])

    const icons = wrapper.findAll('.flex-shrink-0 .h-6.w-6')
    expect(icons[0].text()).toBe('✓')
    expect(icons[1].text()).toBe('✕')
    expect(icons[2].text()).toBe('!')
    expect(icons[3].text()).toBe('i')
  })

  test('removes toast when close button is clicked', async () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Test message', type: 'success' }
    ])

    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')

    const store = useToastStore()
    expect(store.remove).toHaveBeenCalledWith(1)
  })

  test('has correct accessibility attributes', () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Test message', type: 'success' }
    ])

    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.find('button .sr-only').text()).toBe('Close')
  })

  test('applies correct base classes for all toast types', () => {
    const wrapper = createWrapper([
      { id: 1, message: 'Test', type: 'success' }
    ])

    const toast = wrapper.find('.pointer-events-auto')
    expect(toast.classes()).toContain('max-w-sm')
    expect(toast.classes()).toContain('rounded-lg')
    expect(toast.classes()).toContain('shadow-lg')
  })
})
