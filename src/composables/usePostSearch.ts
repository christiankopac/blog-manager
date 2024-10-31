import type { PostsStore } from '../stores/posts'
import { useDebounce } from './useDebounce'
import { computed, ref } from 'vue'

export function usePostSearch(store: PostsStore) {
  const searchQuery = ref('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const filteredPosts = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) {
      return store.posts
    }
    return store.getPostsBySearch(debouncedSearchQuery.value)
  })

  return {
    searchQuery,
    filteredPosts
  }
}