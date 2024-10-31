import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import App from './App.vue'
import { createTestingPinia } from '@pinia/testing'
import { usePostsStore } from '@/stores/posts'

describe('App', () => {
  const mockPosts = [
    {
      id: 1,
      title: 'Test Post 1',
      body: 'Content 1',
      userId: 1
    },
    {
      id: 2,
      title: 'Test Post 2',
      body: 'Content 2',
      userId: 2
    }
  ]

  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@test.com', username: 'user1' },
    { id: 2, name: 'User 2', email: 'user2@test.com', username: 'user2' }
  ]

  const mountApp = () => {
    return mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              posts: {
                posts: mockPosts,
                users: mockUsers,
                isLoading: false,
                error: null,
                pendingPosts: []
              }
            }
          })
        ],
        stubs: {
          Teleport: true,
          Transition: true,
          QuillEditor: true
        }
      }
    })
  }

  test('renders posts list', () => {
    const wrapper = mountApp()
    const rows = wrapper.findAll('[role="row"]')
    expect(rows.length).toBeGreaterThan(0)
  })

  test('handles post selection', async () => {
    const wrapper = mountApp()
    
    // Find the first PostRow component
    const postRow = wrapper.findComponent({ name: 'PostRow' })
    
    // Emit the checkbox-click event directly
    await postRow.vm.$emit('checkbox-click', new MouseEvent('click'), mockPosts[0].id, 0)
    
    // Check if the post is selected
    expect(wrapper.vm.selectedPosts).toContain(mockPosts[0].id)
  })

  test('handles select all', async () => {
    const wrapper = mountApp()
    
    // Find the TableHeader component
    const tableHeader = wrapper.findComponent({ name: 'TableHeader' })
    
    // Emit the toggle-select-all event
    await tableHeader.vm.$emit('toggle-select-all')
    
    // Check if all posts are selected
    const allPostIds = mockPosts.map(post => post.id)
    expect(wrapper.vm.selectedPosts).toEqual(allPostIds)
  })

  test('shows loading state', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              posts: {
                posts: [],
                users: [],
                isLoading: true,
                error: null,
                pendingPosts: []
              }
            }
          })
        ],
        stubs: {
          Teleport: true,
          Transition: true
        }
      }
    })

    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  test('filters posts based on search query', async () => {
    const wrapper = mountApp()
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Test Post 1')

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300))

    const rows = wrapper.findAll('[role="row"]')
    expect(rows.length).toBe(2) // Header row + 1 matching post
  })

  test('opens post menu and shows options', async () => {
    const wrapper = mountApp()
    const menuButton = wrapper.find('button[title="Options"]')
    await menuButton.trigger('click')

    expect(wrapper.vm.activeMenu).toBe(mockPosts[0].id)
  })

  test('handles shift-click selection', async () => {
    const wrapper = mountApp()
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    
    // Click first checkbox
    await checkboxes[1].trigger('click')
    
    // Shift-click last checkbox
    await checkboxes[2].trigger('click', {
      shiftKey: true
    })

    expect(wrapper.vm.selectedPosts).toContain(mockPosts[0].id)
    expect(wrapper.vm.selectedPosts).toContain(mockPosts[1].id)
  })
}) 