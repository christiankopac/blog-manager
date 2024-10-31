import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import PostModal from '../PostModal.vue'
import { createTestingPinia } from '@pinia/testing'

describe('PostModal', () => {
  const users = [
    { id: 1, name: 'Test User', email: 'test@test.com', username: 'test' }
  ]
  
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
    wrapper.vm.quillContent = 'Test content'
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0]).toEqual({
      title: 'Test Title',
      body: 'Test content',
      userId: 1
    })
  })

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

    expect(wrapper.find('#title').element.value).toBe('Existing Post')
    expect(wrapper.find('#author').element.value).toBe('1')
  })
})