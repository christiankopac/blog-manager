import { onMounted, onUnmounted } from 'vue'

export function useKeyboardNavigation(handlers: {
  escape?: () => void
  enter?: () => void
  delete?: () => void
}) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    const handler = handlers[event.key.toLowerCase() as keyof typeof handlers]
    if (handler && (event.key !== 'Enter' || !event.isComposing)) {
      handler()
    }
  }

  onMounted(() => document.addEventListener('keydown', handleKeydown))
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
}