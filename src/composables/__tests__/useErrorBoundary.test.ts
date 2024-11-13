import { describe, expect, test, vi } from 'vitest'
import { useErrorBoundary } from '../useErrorBoundary'
import { mount } from '@vue/test-utils'

describe('useErrorBoundary', () => {
  test('initializes with null error', () => {
    const TestComponent = {
      template: '<div>Test</div>',
      setup() {
        const { error } = useErrorBoundary()
        return { error }
      }
    }
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.error).toBeNull()
  })

  test('captures error and prevents propagation', () => {
    const error = new Error('Test error')
   
    const ChildComponent = {
      template: '<div>Child</div>',
      setup() {
        throw error
      }
    }
    const ParentComponent = {
      components: { ChildComponent },
      template: '<div><child-component /></div>',
      setup() {
        const { error } = useErrorBoundary()
        return { error }
      }
    }
    const wrapper = mount(ParentComponent, {
      global: {
        config: {
          errorHandler: undefined // Prevent Vue from logging the error
        }
      }
    })
    // Use type assertion to handle the Vue type system
    type VmType = { error: Error | null }
    expect((wrapper.vm as unknown as VmType).error).toBe(error)
  })

  test('resets error state', async () => {
    const error = new Error('Test error')
   
    const TestComponent = {
      template: '<div>Test</div>',
      setup() {
        const { error, resetError } = useErrorBoundary()
        return { error, resetError }
      }
    }
    const wrapper = mount(TestComponent)
   
    // Use type assertion for the setter and getter
    type VmType = { 
      error: Error | null;
      resetError: () => Promise<void>;
    }
    const vm = wrapper.vm as unknown as VmType
    
    // Manually set error through component's state management instead
    // of direct assignment
    vm.error = error
    expect(vm.error).toBe(error)
    
    // Reset error
    await vm.resetError()
    expect(vm.error).toBeNull()
  })

  test('prevents error from propagating to parent', () => {
    const error = new Error('Test error')
    const parentErrorHandler = vi.fn()
   
    const ChildComponent = {
      template: '<div>Child</div>',
      setup() {
        throw error
      }
    }
    const ParentComponent = {
      components: { ChildComponent },
      template: '<div><child-component /></div>',
      setup() {
        const { error } = useErrorBoundary()
        return { error }
      }
    }
    mount(ParentComponent, {
      global: {
        config: {
          errorHandler: parentErrorHandler
        }
      }
    })
    expect(parentErrorHandler).not.toHaveBeenCalled()
  })
})