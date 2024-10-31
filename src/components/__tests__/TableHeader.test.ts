import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import TableHeader from '../TableHeader.vue'

describe('TableHeader', () => {
  test('renders all column headers correctly', () => {
    const wrapper = mount(TableHeader, {
      props: {
        allPostsSelected: false
      }
    })

    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Author')
  })

  test('emits toggle-select-all when checkbox is changed', async () => {
    const wrapper = mount(TableHeader, {
      props: {
        allPostsSelected: false
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')

    expect(wrapper.emitted('toggle-select-all')).toBeTruthy()
    expect(wrapper.emitted('toggle-select-all')).toHaveLength(1)
  })

  test('checkbox reflects allPostsSelected prop', async () => {
    const wrapper = mount(TableHeader, {
      props: {
        allPostsSelected: true
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.element.checked).toBe(true)

    // Test with false value
    await wrapper.setProps({ allPostsSelected: false })
    expect(checkbox.element.checked).toBe(false)
  })

  test('maintains responsive layout classes', () => {
    const wrapper = mount(TableHeader, {
      props: {
        allPostsSelected: false
      }
    })

    // Title column
    const titleCol = wrapper.find('.col-span-8.sm\\:col-span-5')
    expect(titleCol.exists()).toBe(true)

    // Description column (hidden on mobile)
    const descriptionCol = wrapper.find('.hidden.sm\\:block.sm\\:col-span-5')
    expect(descriptionCol.exists()).toBe(true)

    // Author column
    const authorCol = wrapper.find('.col-span-4.sm\\:col-span-2')
    expect(authorCol.exists()).toBe(true)
  })
})
