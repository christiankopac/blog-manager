import { ref } from 'vue'

// This composable:
// - Defines types and interfaces for toast notifications
// - Manages a reactive array of active toasts
// - Provides methods to:
//   - Add new toasts with auto-removal
//   - Remove existing toasts
//   - Update toast messages
// - Includes convenience methods for different toast types
// - Uses unique IDs for toast identification

// Define possible toast notification types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

// Interface for toast notification structure
export interface Toast {
  id: number        // Unique identifier
  message: string   // Toast message content
  type: ToastType   // Type of toast notification
  duration?: number // Optional display duration
}

// Counter for generating unique toast IDs
let nextId = 0

/**
 * Custom composable for managing toast notifications
 * Provides functionality to add, remove, and update toasts
 * 
 * @returns Object containing toast state and methods
 */
export function useToast() {
  // Reactive array to store active toasts
  const toasts = ref<Toast[]>([])

  /**
   * Adds a new toast notification
   * @param message - Toast message
   * @param type - Toast type (defaults to 'info')
   * @param duration - Display duration in ms (defaults to 5000)
   */
  const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const toast: Toast = {
      id: ++nextId,
      message,
      type,
      duration
    }
    toasts.value.push(toast)
    
    // Auto-remove toast after duration if specified
    if (duration > 0) {
      setTimeout(() => removeToast(toast.id), duration)
    }
  }

  /**
   * Removes a toast by ID
   * @param id - ID of toast to remove
   */
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,      // Active toasts array
    addToast,    // Generic toast addition
    removeToast, // Toast removal
    // Convenience methods for different toast types
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    // Method to update existing toast message
    update: (id: number, message: string) => {
      const toast = toasts.value.find(t => t.id === id)
      if (toast) {
        toast.message = message
      }
    }
  }
}

