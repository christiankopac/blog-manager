import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ActionButtons from '../ActionButtons.vue'

// Tests for ActionButtons.vue component
describe('ActionButtons', () => {
  // Visual and styling tests
  test('renders create button with correct text and styling', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0,
        showDeleteModal: false
      }
    })

    const createButton = wrapper.find('button')
    expect(createButton.text()).toBe('Create new post')
    expect(createButton.classes()).toContain('bg-blue-600')
    expect(createButton.classes()).toContain('dark:bg-blue-500')
  })

  // Conditional rendering tests
  test('shows delete button only when posts are selected', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0,
        showDeleteModal: false
      }
    })

    // Initially no delete button
    expect(wrapper.text()).not.toContain('Delete Selected')

    // Show delete button when posts are selected
    await wrapper.setProps({ selectedCount: 2 })
    expect(wrapper.text()).toContain('Delete Selected (2)')
  })

  // Disabled state tests
  test('disables create button when loading', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: true,
        selectedCount: 0,
        showDeleteModal: false
      }
    })

    const createButton = wrapper.find('button')
    expect(createButton.attributes('disabled')).toBeDefined()
    expect(createButton.classes()).toContain('disabled:opacity-50')
  })

  // Event emission tests
  test('emits create event when create button is clicked', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 0,
        showDeleteModal: false
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
        selectedCount: 2,
        showDeleteModal: false
      }
    })

    const deleteButton = wrapper.findAll('button')[1] // Second button
    await deleteButton.trigger('click')
    expect(wrapper.emitted('delete-selected')).toBeTruthy()
    expect(wrapper.emitted('delete-selected')).toHaveLength(1)
  })

  // Responsive design tests
  test('maintains responsive layout classes', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: false,
        selectedCount: 1,
        showDeleteModal: false
      }
    })
    const buttons = wrapper.findAll('button')
    for (const button of buttons) {
      expect(button.classes()).toContain('flex-grow')
      expect(button.classes()).toContain('sm:flex-grow-0')
    }
  })
})