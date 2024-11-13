import type { Toast, ToastType } from '@/types/toast'
import { defineStore } from 'pinia'

// This store:
// - Manages toast notifications using Pinia
// - Supports different notification types (success, error, warning, info)
// - Handles auto-dismissal with configurable duration
// - Provides persistent toasts that don't auto-dismiss
// - Allows updating existing toast messages
// - Includes convenience methods for each toast type
// - Uses unique IDs for toast identification

// Store state interface
interface ToastState {
  toasts: Toast[]   // Array of active toasts
}

// Counter for generating unique IDs
let nextId = 0

// Define and export the toast store
export const useToastStore = defineStore('toast', {
  // Initial state
  state: (): ToastState => ({
    toasts: []
  }),

  // Store actions
  actions: {
    // Show a new toast notification
    show(message: string, type: ToastType = 'info', duration = 5000) {
      const id = ++nextId
      this.toasts.push({ id, message, type, duration })
      
      // Auto-remove after duration if specified
      if (duration > 0) {
        setTimeout(() => this.remove(id), duration)
      }
    },

    // Remove a toast by ID
    remove(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    // Convenience methods for different toast types
    success(message: string, duration?: number) {
      this.show(message, 'success', duration)
    },

    error(message: string, duration?: number) {
      this.show(message, 'error', duration)
    },

    warning(message: string, duration?: number) {
      this.show(message, 'warning', duration)
    },

    info(message: string, duration?: number) {
      this.show(message, 'info', duration)
    },

    // Show or update a persistent toast
    showPersistent(message: string, type: ToastType = 'info', existingId?: number) {
      if (existingId !== undefined) {
        const index = this.toasts.findIndex(toast => toast.id === existingId)
        if (index > -1) {
          this.toasts[index] = { ...this.toasts[index], message, type }
          return existingId
        }
      }

      const id = ++nextId
      this.toasts.push({ id, message, type, duration: -1 })
      return id
    },

    // Update toast message
    update(id: number, message: string) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts[index].message = message
      }
    },

    // Dismiss toast
    dismiss(id: number) {
      this.remove(id)
    }
  }
})

