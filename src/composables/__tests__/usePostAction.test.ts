import { describe, expect, test, vi } from 'vitest'
import { usePostAction } from '../usePostAction'
import { createTestingPinia } from '@pinia/testing'
import { usePostsStore } from '../../stores/posts'

// Tests for usePostAction composable
describe('usePostAction', () => {
  const mockPostData = {
    title: 'Test Post',
    body: 'Test Content',
    userId: 1
  }

  // Create operation tests
  test('calls store.savePost with create post data', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    
    const store = usePostsStore(pinia)
    const { savePost } = usePostAction(store)

    await savePost(mockPostData)

    expect(store.savePost).toHaveBeenCalledWith(mockPostData)
    expect(store.savePost).toHaveBeenCalledTimes(1)
  })

  // Update operation tests
  test('calls store.savePost with update post data', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    
    const store = usePostsStore(pinia)
    const { savePost } = usePostAction(store)

    const updatePostData = {
      ...mockPostData,
      id: 1
    }

    await savePost(updatePostData)

    expect(store.savePost).toHaveBeenCalledWith(updatePostData)
    expect(store.savePost).toHaveBeenCalledTimes(1)
  })

  // Result handling tests
  test('returns the result from store.savePost', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    
    const store = usePostsStore(pinia)
    const expectedResult = { ...mockPostData, id: 1 }
    store.savePost = vi.fn().mockResolvedValue(expectedResult)

    const { savePost } = usePostAction(store)
    const result = await savePost(mockPostData)

    expect(result).toEqual(expectedResult)
  })

  // Error handling tests
  test('propagates errors from store.savePost', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    
    const store = usePostsStore(pinia)
    const error = new Error('Save failed')
    store.savePost = vi.fn().mockRejectedValue(error)

    const { savePost } = usePostAction(store)

    await expect(savePost(mockPostData)).rejects.toThrow('Save failed')
  })
})
