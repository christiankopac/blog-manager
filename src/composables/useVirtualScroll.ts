import { ref, computed, onMounted, onUnmounted } from 'vue'

// This composable:
// - Implements virtual scrolling for large lists
// - Manages scroll position and viewport calculations
// - Only renders items that are visible in viewport (plus buffer)
// - Handles window resize events
// - Provides positioning data for rendered items
// - Returns necessary refs and computed properties for implementation

/**
 * Interface for virtual scroll configuration options
 */
interface VirtualScrollOptions {
  itemHeight: number  // Fixed height of each item
  buffer?: number     // Number of items to render outside viewport
}

/**
 * Custom composable for virtual scrolling implementation
 * Optimizes rendering of large lists by only rendering visible items
 * 
 * @param items - Array of items to be virtually scrolled
 * @param options - Configuration options for virtual scroll
 * @returns Object containing refs and computed properties for virtual scroll
 */
export function useVirtualScroll<T>(items: T[], options: VirtualScrollOptions) {
  // Reactive references for scroll container
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  // Destructure options with defaults
  const { itemHeight, buffer = 5 } = options

  /**
   * Computed property that determines which items should be rendered
   * Based on current scroll position and viewport height
   */
  const visibleItems = computed(() => {
    if (!containerRef.value) return []

    // Calculate visible range with buffer
    const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop.value + viewportHeight.value) / itemHeight) + buffer
    )

    // Map visible items to include positioning data
    return items.slice(start, end).map((item, index) => ({
      index: start + index,
      data: item,
      style: {
        position: 'absolute',
        top: `${(start + index) * itemHeight}px`,
        height: `${itemHeight}px`,
        left: 0,
        right: 0,
      }
    }))
  })

  /**
   * Computed total height of all items
   * Used for scroll container sizing
   */
  const totalHeight = computed(() => items.length * itemHeight)

  /**
   * Handler for scroll events
   * Updates scroll position state
   */
  const handleScroll = (event: Event) => {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  /**
   * Updates viewport height when container size changes
   */
  const updateViewportHeight = () => {
    if (containerRef.value) {
      viewportHeight.value = containerRef.value.clientHeight
    }
  }

  // Setup and cleanup resize listener
  onMounted(() => {
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewportHeight)
  })

  return {
    containerRef,   // Reference to scroll container
    visibleItems,   // Currently visible items with positioning
    totalHeight,    // Total scrollable height
    handleScroll    // Scroll event handler
  }
}

