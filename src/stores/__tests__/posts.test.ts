import { setActivePinia, createPinia } from 'pinia'
import { usePostsStore } from '../posts'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as postsApi from '../../api/posts'
import { useToastStore } from '../toast'

describe('Posts Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    
    vi.resetAllMocks()
    
    vi.mock('@/api/posts')

    const toastStore = useToastStore()
    vi.spyOn(toastStore, 'success').mockImplementation(() => {})
    vi.spyOn(toastStore, 'error').mockImplementation(() => {})
  })

  test('filters posts by search query', () => {
    const store = usePostsStore()
    store.posts = [
      { id: 1, title: 'Test Post', body: 'content', userId: 1 },
      { id: 2, title: 'Another Post', body: 'content', userId: 1 }
    ]
    
    const results = store.getPostsBySearch('Test')
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Test Post')
  })

  test('handles optimistic updates for post creation', async () => {
    const store = usePostsStore()
    const newPost = { title: 'New Post', body: 'content', userId: 1 }
    
    const mockResponse = { id: 1, ...newPost }
    vi.spyOn(postsApi, 'createPost').mockResolvedValue(mockResponse)
    
    const result = await store.savePost(newPost)
    
    expect(result).toBe(true)
    expect(postsApi.createPost).toHaveBeenCalledWith(newPost)
    expect(store.posts).toContainEqual(mockResponse)
  })

  test('handles post deletion', async () => {
    const store = usePostsStore()
    const postToDelete = { id: 1, title: 'Test Post', body: 'content', userId: 1 }
    store.posts = [postToDelete]
    
    vi.spyOn(postsApi, 'deletePost').mockResolvedValue(undefined)
    
    const result = await store.deletePost(1)
    
    expect(result).toBe(true)
    expect(postsApi.deletePost).toHaveBeenCalledWith(1)
    expect(store.posts).not.toContainEqual(postToDelete)
  })

  test('handles bulk post deletion', async () => {
    const store = usePostsStore()
    const posts = [
      { id: 1, title: 'Post 1', body: 'content', userId: 1 },
      { id: 2, title: 'Post 2', body: 'content', userId: 1 }
    ]
    store.posts = posts
    
    vi.spyOn(postsApi, 'deletePost').mockResolvedValue(undefined)
    
    await store.deletePosts([1, 2])
    
    expect(postsApi.deletePost).toHaveBeenCalledTimes(2)
    expect(store.posts).toHaveLength(0)
  })
})
