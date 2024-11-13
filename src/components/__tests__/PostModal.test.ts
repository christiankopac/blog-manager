import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import PostModal from '../PostModal.vue'
import { createTestingPinia } from '@pinia/testing'

// Tests for PostModal.vue component
describe('PostModal', () => {
  const users = [
    { id: 1, name: 'Test User', email: 'test@test.com', username: 'test' }
  ]
  
  // Form validation tests
  test('validates required fields', async () => {
    const wrapper = mount(PostModal, {
      props: {
        post: null,
        users
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          QuillEditor: true,
          Suspense: false
        }
      }
    })

    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.text()).toContain('Title is required')
    expect(wrapper.text()).toContain('Select an author')
  })

  // Form submission tests
  test('emits save event with valid data', async () => {
    const wrapper = mount(PostModal, {
      props: {
        post: null,
        users
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          QuillEditor: {
            template: '<div class="quill-editor"></div>',
            props: ['content'],
            emits: ['update:content']
          },
          Suspense: false
        }
      }
    })

    // Fill in the form
    await wrapper.find('#title').setValue('Test Title')
    await wrapper.find('#author').setValue('1')
    
    // Simulate Quill content update
    await wrapper.findComponent({ name: 'QuillEditor' }).vm.$emit('update:content', 'Test content')
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit')

    const emittedSave = wrapper.emitted('save')
    expect(emittedSave).toBeTruthy()
    expect(emittedSave?.[0][0]).toEqual({
      title: 'Test Title',
      body: 'Test content',
      userId: 1
    })
  })

  // Editing mode tests
  test('pre-fills form when editing existing post', () => {
    const existingPost = {
      id: 1,
      title: 'Existing Post',
      body: 'Existing content',
      userId: 1
    }

    const wrapper = mount(PostModal, {
      props: {
        post: existingPost,
        users
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          QuillEditor: true,
          Suspense: false
        }
      }
    })

    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Existing Post')
    expect((wrapper.find('#author').element as HTMLSelectElement).value).toBe('1')
  })
})