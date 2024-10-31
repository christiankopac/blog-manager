import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue'

describe('DeleteConfirmationModal', () => {
  test('does not render when showDeleteModal is false', () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: false
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  test('renders when showDeleteModal is true', () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: true
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.find('#modal-title').text()).toBe('Confirm Delete')
  })

  test('emits confirm event when delete button is clicked', async () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: true
      }
    })

    const deleteButton = wrapper.find('button.bg-red-600')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  test('emits close event when cancel button is clicked', async () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: true
      }
    })

    const cancelButton = wrapper.find('button.bg-gray-200')
    await cancelButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  test('emits close event when backdrop is clicked', async () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: true
      }
    })

    const backdrop = wrapper.find('.backdrop-blur-sm')
    await backdrop.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  test('displays correct confirmation message', () => {
    const wrapper = mount(DeleteConfirmationModal, {
      props: {
        showDeleteModal: true
      }
    })

    const message = wrapper.find('.text-gray-700')
    expect(message.text()).toBe('Are you sure you want to delete this post? This action cannot be undone.')
  })
})
