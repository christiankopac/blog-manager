import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

let nextId = 0

export function useToast() {
  const toasts = ref<Toast[]>([])

  const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const toast: Toast = {
      id: ++nextId,
      message,
      type,
      duration
    }
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => removeToast(toast.id), duration)
    }
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    update: (id: number, message: string) => {
      const toast = toasts.value.find(t => t.id === id)
      if (toast) {
        toast.message = message
      }
    }
  }
}