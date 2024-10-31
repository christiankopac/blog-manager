import { ref, computed, watchEffect } from 'vue'

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const currentPage = ref(1)
  
  watchEffect(() => {
    if (items.length === 0) {
      currentPage.value = 1
    } else {
      const maxPage = Math.ceil(items.length / itemsPerPage)
      currentPage.value = Math.min(currentPage.value, maxPage)
    }
  })

  const totalPages = computed(() => Math.ceil(items.length / itemsPerPage))
  
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    previousPage
  }
}