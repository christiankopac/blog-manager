import { describe, expect, test } from 'vitest'
import { usePostModal } from '../usePostModal'

describe('usePostModal', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test Content',
    userId: 1
  }

  test('initializes with modal closed and no selected post', () => {
    const { showModal, selectedPost } = usePostModal()
    
    expect(showModal.value).toBe(false)
    expect(selectedPost.value).toBeNull()
  })

  test('openCreateModal opens modal without selected post', () => {
    const { showModal, selectedPost, openCreateModal } = usePostModal()
    
    openCreateModal()
    
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toBeNull()
  })

  test('openEditModal opens modal with selected post', () => {
    const { showModal, selectedPost, openEditModal } = usePostModal()
    
    openEditModal(mockPost)
    
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toEqual(mockPost)
  })

  test('closeModal closes modal and clears selected post', () => {
    const { showModal, selectedPost, openEditModal, closeModal } = usePostModal()
    
    // First open the modal with a post
    openEditModal(mockPost)
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toEqual(mockPost)
    
    // Then close it
    closeModal()
    expect(showModal.value).toBe(false)
    expect(selectedPost.value).toBeNull()
  })
})
