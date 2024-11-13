import { ref, computed, watchEffect } from 'vue'

// This composable:
// - Takes an array of items and items per page count
// - Manages current page state
// - Watches for changes in items array to handle edge cases
// - Provides computed properties for:
//   - Total pages
//   - Current page items
// - Includes methods for page navigation
// - Returns pagination state and control methods

/**
 * Custom composable for handling pagination
 * Manages page state and provides paginated data
 * 
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items to show per page
 * @returns Object containing pagination state and controls
 */
export function usePagination<T>(items: T[], itemsPerPage: number) {
  // Reactive reference for current page number
  const currentPage = ref(1)
  
  /**
   * Watch effect to handle edge cases:
   * - Reset to page 1 when items array is empty
   * - Adjust current page if it exceeds max pages after items change
   */
  watchEffect(() => {
    if (items.length === 0) {
      currentPage.value = 1
    } else {
      const maxPage = Math.ceil(items.length / itemsPerPage)
      currentPage.value = Math.min(currentPage.value, maxPage)
    }
  })

  /**
   * Computed property for total number of pages
   * Based on items length and items per page
   */
  const totalPages = computed(() => Math.ceil(items.length / itemsPerPage))
  
  /**
   * Computed property that returns current page items
   * Slices items array based on current page and items per page
   */
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  })

  /**
   * Move to next page if available
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  /**
   * Move to previous page if available
   */
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  return {
    currentPage,    // Current page number
    totalPages,     // Total number of pages
    paginatedItems, // Items for current page
    nextPage,       // Go to next page
    previousPage    // Go to previous page
  }
}
