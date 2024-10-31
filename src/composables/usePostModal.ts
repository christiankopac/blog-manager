import { ref } from 'vue'
import type { Post } from '../types'

export function usePostModal() {
  const showModal = ref(false)
  const selectedPost = ref<Post | null>(null)

  const openCreateModal = () => {
    selectedPost.value = null
    showModal.value = true
  }

  const openEditModal = (post: Post) => {
    selectedPost.value = post
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedPost.value = null
  }

  return {
    showModal,
    selectedPost,
    openCreateModal,
    openEditModal,
    closeModal
  }
}