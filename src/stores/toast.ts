import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: Toast[]
}

let nextId = 0

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: []
  }),

  actions: {
    show(message: string, type: ToastType = 'info', duration = 5000) {
      const id = ++nextId
      this.toasts.push({ id, message, type, duration })
      
      if (duration > 0) {
        setTimeout(() => this.remove(id), duration)
      }
    },

    remove(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

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

    update(id: number, message: string) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts[index].message = message
      }
    },

    dismiss(id: number) {
      this.remove(id)
    }
  }
})