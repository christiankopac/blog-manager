import { describe, expect, test } from 'vitest'
import { usePostModal } from '../usePostModal'

describe('usePostModal', () => {
  // Mock post data for testing
  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test Content',
    userId: 1
  }

  // Test initial state of modal
  test('initializes with modal closed and no selected post', () => {
    const { showModal, selectedPost } = usePostModal()
    
    // Verify modal starts closed with no post
    expect(showModal.value).toBe(false)
    expect(selectedPost.value).toBeNull()
  })

  // Test create mode
  test('openCreateModal opens modal without selected post', () => {
    const { showModal, selectedPost, openCreateModal } = usePostModal()
    
    // Open modal in create mode
    openCreateModal()
    
    // Verify modal is open but no post selected
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toBeNull()
  })

  // Test edit mode
  test('openEditModal opens modal with selected post', () => {
    const { showModal, selectedPost, openEditModal } = usePostModal()
    
    // Open modal in edit mode with mock post
    openEditModal(mockPost)
    
    // Verify modal is open with correct post
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toEqual(mockPost)
  })

  // Test modal closure
  test('closeModal closes modal and clears selected post', () => {
    const { showModal, selectedPost, openEditModal, closeModal } = usePostModal()
    
    // First open the modal with a post
    openEditModal(mockPost)
    expect(showModal.value).toBe(true)
    expect(selectedPost.value).toEqual(mockPost)
    
    // Then close it and verify reset state
    closeModal()
    expect(showModal.value).toBe(false)
    expect(selectedPost.value).toBeNull()
  })
})
