import { describe, expect, test, vi } from 'vitest'
import { usePostSearch } from '../usePostSearch'
import { createTestingPinia } from '@pinia/testing'
import { usePostsStore } from '../../stores/posts'
import { nextTick, ref } from 'vue'

// Create a controlled debounced value for testing
const debouncedValue = ref('')
vi.mock('../useDebounce', () => ({
  useDebounce: () => debouncedValue
}))

describe('usePostSearch', () => {
  const mockPosts = [
    {
      id: 1,
      title: 'Test Post 1',
      body: 'Content 1',
      userId: 1
    },
    {
      id: 2,
      title: 'Another Post',
      body: 'Content 2',
      userId: 2
    }
  ]

  test('returns all posts when search query is empty', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        posts: {
          posts: mockPosts
        }
      }
    })
    
    const store = usePostsStore(pinia)
    const { searchQuery, filteredPosts } = usePostSearch(store)

    searchQuery.value = ''
    debouncedValue.value = ''
    expect(filteredPosts.value).toEqual(mockPosts)
  })

  test('returns all posts when search query is only whitespace', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        posts: {
          posts: mockPosts
        }
      }
    })
    
    const store = usePostsStore(pinia)
    const { searchQuery, filteredPosts } = usePostSearch(store)

    searchQuery.value = '   '
    debouncedValue.value = '   '
    expect(filteredPosts.value).toEqual(mockPosts)
  })

  test('uses store.getPostsBySearch with debounced query', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        posts: {
          posts: mockPosts
        }
      }
    })
    
    const store = usePostsStore(pinia)
    store.getPostsBySearch = vi.fn().mockReturnValue([mockPosts[0]])
    
    const { searchQuery, filteredPosts } = usePostSearch(store)

    // Set both the raw and debounced values
    searchQuery.value = 'Test'
    debouncedValue.value = 'Test'

    // Access filteredPosts to trigger the computed property
    await nextTick()
    const posts = filteredPosts.value

    expect(store.getPostsBySearch).toHaveBeenCalledWith('Test')
    expect(posts).toEqual([mockPosts[0]])
  })

  test('reactive updates when search query changes', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        posts: {
          posts: mockPosts
        }
      }
    })
    
    const store = usePostsStore(pinia)
    store.getPostsBySearch = vi.fn()
      .mockImplementation(query => 
        mockPosts.filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase())
        )
      )
    
    const { searchQuery, filteredPosts } = usePostSearch(store)

    // Initial state
    expect(filteredPosts.value).toEqual(mockPosts)

    // Update both raw and debounced search
    searchQuery.value = 'Test'
    debouncedValue.value = 'Test'
    expect(filteredPosts.value).toEqual([mockPosts[0]])

    // Clear search
    searchQuery.value = ''
    debouncedValue.value = ''
    expect(filteredPosts.value).toEqual(mockPosts)
  })
})
