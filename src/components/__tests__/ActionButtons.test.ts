import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ActionButtons from '../ActionButtons.vue'

describe('ActionButtons', () => {
  test('renders create button with correct text and styling', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0
      }
    })

    const createButton = wrapper.find('button')
    expect(createButton.text()).toBe('Create new post')
    expect(createButton.classes()).toContain('bg-blue-600')
    expect(createButton.classes()).toContain('dark:bg-blue-500')
  })

  test('shows delete button only when posts are selected', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0
      }
    })

    // Initially no delete button
    expect(wrapper.text()).not.toContain('Delete Selected')

    // Show delete button when posts are selected
    await wrapper.setProps({ selectedCount: 2 })
    expect(wrapper.text()).toContain('Delete Selected (2)')
  })

  test('disables create button when loading', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: true,
        selectedCount: 0
      }
    })

    const createButton = wrapper.find('button')
    expect(createButton.attributes('disabled')).toBeDefined()
    expect(createButton.classes()).toContain('disabled:opacity-50')
  })

  test('emits create event when create button is clicked', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('create')).toBeTruthy()
    expect(wrapper.emitted('create')).toHaveLength(1)
  })

  test('emits delete-selected event when delete button is clicked', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 2
      }
    })

    const deleteButton = wrapper.findAll('button')[1] // Second button
    await deleteButton.trigger('click')
    expect(wrapper.emitted('delete-selected')).toBeTruthy()
    expect(wrapper.emitted('delete-selected')).toHaveLength(1)
  })

  test('maintains responsive layout classes', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 1
      }
    })
    const buttons = wrapper.findAll('button')
    for (const button of buttons) {
      expect(button.classes()).toContain('flex-grow')
      expect(button.classes()).toContain('sm:flex-grow-0')
    }
  })
})
