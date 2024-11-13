import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SearchBar from '../SearchBar.vue'

// Tests for SearchBar.vue component
describe('SearchBar', () => {
  // Input event tests
  test('emits update:modelValue event on input', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('test search')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test search'])
  })
  
  // Props reflection tests
  test('displays the modelValue prop', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'initial value',
        isLoading: false
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('initial value')
  })
  
  // Loading state tests
  test('disables input when isLoading is true', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: true
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  test('enables input when isLoading is false', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).disabled).toBe(false)
  })
})
