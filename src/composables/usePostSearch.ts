import type { PostsStore } from '../stores/posts'
import { useDebounce } from './useDebounce'
import { computed, ref } from 'vue'

/**
 * Custom composable for post search functionality
 * Provides debounced search and filtered posts list
 * 
 * @param store - Instance of the posts store
 * @returns Object containing search state and filtered results
 */
export function usePostSearch(store: PostsStore) {
  // Reactive reference for search query
  const searchQuery = ref('')
  
  // Debounced version of search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  /**
   * Computed property that filters posts based on search query
   * Returns all posts if query is empty, otherwise filters by search term
   */
  const filteredPosts = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) {
      return store.posts
    }
    return store.getPostsBySearch(debouncedSearchQuery.value)
  })

  return {
    searchQuery,    // Reactive search query
    filteredPosts   // Computed filtered posts array
  }
}

// This composable:
// - Takes a posts store instance as parameter
// - Creates reactive search query state
// - Implements debounced search to improve performance
// - Provides computed filtered posts based on search term
// - Returns search query and filtered results for use in components