import { ref } from 'vue'
import type { Post } from '../types'

/**
 * Custom composable for managing post modal state
 * Handles showing/hiding modal and selected post data
 * 
 * @returns Object containing modal state and control methods
 */
export function usePostModal() {
  // Reactive reference for modal visibility
  const showModal = ref(false)
  
  // Reactive reference for currently selected post
  const selectedPost = ref<Post | null>(null)

  /**
   * Opens modal in create mode
   * Clears selected post and shows modal
   */
  const openCreateModal = () => {
    selectedPost.value = null
    showModal.value = true
  }

  /**
   * Opens modal in edit mode
   * Sets selected post and shows modal
   * @param post - Post to be edited
   */
  const openEditModal = (post: Post) => {
    selectedPost.value = post
    showModal.value = true
  }

  /**
   * Closes modal and resets state
   * Hides modal and clears selected post
   */
  const closeModal = () => {
    showModal.value = false
    selectedPost.value = null
  }

  return {
    showModal,       // Modal visibility state
    selectedPost,    // Currently selected post
    openCreateModal, // Open modal for creation
    openEditModal,   // Open modal for editing
    closeModal      // Close and reset modal
  }
}

// This composable:

// - Manages modal visibility state
// - Tracks currently selected post
// - Provides methods to:
//   - Open modal for creating new posts
//   - Open modal for editing existing posts
//   - Close modal and reset state
// - Returns modal state and control methods
