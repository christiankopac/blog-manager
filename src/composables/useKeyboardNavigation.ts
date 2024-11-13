import { onMounted, onUnmounted } from 'vue'

// This composable:
// - Takes an object of keyboard event handlers
// - Creates a keydown event handler that:
//   - Ignores input/textarea elements
//   - Handles IME composition
//   - Executes corresponding handler for pressed key
// - Sets up and cleans up event listeners using Vue lifecycle hooks
// - Provides type safety for handler keys

/**
 * Custom composable for handling keyboard navigation
 * Manages keyboard event listeners and executes corresponding handlers
 * 
 * @param handlers - Object containing keyboard event handlers
 * @param handlers.escape - Handler for Escape key
 * @param handlers.enter - Handler for Enter key
 * @param handlers.delete - Handler for Delete key
 */
export function useKeyboardNavigation(handlers: {
  escape?: () => void
  enter?: () => void
  delete?: () => void
}) {
  /**
   * Event handler for keydown events
   * Ignores input/textarea elements and handles composition events
   */
  const handleKeydown = (event: KeyboardEvent) => {
    // Ignore keyboard events in input/textarea elements
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // Get handler for the pressed key
    const handler = handlers[event.key.toLowerCase() as keyof typeof handlers]
    
    // Execute handler if it exists and not during IME composition
    if (handler && (event.key !== 'Enter' || !event.isComposing)) {
      handler()
    }
  }

  // Add keyboard event listener on component mount
  onMounted(() => document.addEventListener('keydown', handleKeydown))
  
  // Remove keyboard event listener on component unmount
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
}

