import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import PostRow from '../PostRow.vue'

describe('PostRow', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test content',
    userId: 1
  }

  const defaultProps = {
    post: mockPost,
    index: 0,
    isSelected: false,
    isPending: false,
    activeMenu: null,
    userName: 'Test User'
  }

  test('renders post details correctly', () => {
    const wrapper = mount(PostRow, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Test Post')
    expect(wrapper.text()).toContain('Test content')
    expect(wrapper.text()).toContain('Test User')
  })

  test('emits checkbox-click event with correct parameters', async () => {
    const wrapper = mount(PostRow, {
      props: defaultProps
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('click')

    expect(wrapper.emitted('checkbox-click')).toBeTruthy()
    expect(wrapper.emitted('checkbox-click')![0][1]).toBe(mockPost.id)
    expect(wrapper.emitted('checkbox-click')![0][2]).toBe(0) // index
  })

  test('shows loading spinner when isPending is true', () => {
    const wrapper = mount(PostRow, {
      props: {
        ...defaultProps,
        isPending: true
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('.opacity-50').exists()).toBe(true)
  })

  test('toggles menu visibility when menu button is clicked', async () => {
    const wrapper = mount(PostRow, {
      props: defaultProps
    })

    const menuButton = wrapper.find('button[title="Options"]')
    await menuButton.trigger('click')

    expect(wrapper.emitted('toggle-menu')).toBeTruthy()
    expect(wrapper.emitted('toggle-menu')![0]).toEqual([mockPost.id])
  })

  test('shows menu options when activeMenu matches post id', () => {
    const wrapper = mount(PostRow, {
      props: {
        ...defaultProps,
        activeMenu: mockPost.id
      }
    })

    const menu = wrapper.find('.absolute.right-\\[-7px\\]')
    expect(menu.exists()).toBe(true)
    expect(menu.find('button:first-child').text()).toBe('Edit')
    expect(menu.find('button:last-child').text()).toBe('Delete')
  })

  test('emits edit event with post data', async () => {
    const wrapper = mount(PostRow, {
      props: {
        ...defaultProps,
        activeMenu: mockPost.id
      }
    })

    const editButton = wrapper.find('.absolute.right-\\[-7px\\] button:first-child')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockPost])
  })

  test('emits delete event with post id', async () => {
    const wrapper = mount(PostRow, {
      props: {
        ...defaultProps,
        activeMenu: mockPost.id
      }
    })

    const deleteButton = wrapper.find('.absolute.right-\\[-7px\\] button:last-child')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockPost.id])
  })

  test('checkbox reflects isSelected prop', () => {
    const wrapper = mount(PostRow, {
      props: {
        ...defaultProps,
        isSelected: true
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.element.checked).toBe(true)
  })
})
