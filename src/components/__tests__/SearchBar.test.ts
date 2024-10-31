import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
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

  test('displays the modelValue prop', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'initial value',
        isLoading: false
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.element.value).toBe('initial value')
  })

  test('disables input when isLoading is true', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: true
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.element.disabled).toBe(true)
  })

  test('enables input when isLoading is false', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: false
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.element.disabled).toBe(false)
  })
})
