import { ref, computed, onMounted, onUnmounted } from 'vue'

interface VirtualScrollOptions {
  itemHeight: number
  buffer?: number
}

export function useVirtualScroll<T>(items: T[], options: VirtualScrollOptions) {
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  const { itemHeight, buffer = 5 } = options

  const visibleItems = computed(() => {
    if (!containerRef.value) return []

    const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop.value + viewportHeight.value) / itemHeight) + buffer
    )

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

  const totalHeight = computed(() => items.length * itemHeight)

  const handleScroll = (event: Event) => {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  const updateViewportHeight = () => {
    if (containerRef.value) {
      viewportHeight.value = containerRef.value.clientHeight
    }
  }

  onMounted(() => {
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewportHeight)
  })

  return {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll
  }
}