<script setup lang="ts">
import { useToastStore } from '../stores/toast'
import type { ToastType } from '../types/toast'

// Access the toast store
const store = useToastStore()

// Function to get CSS classes for the toast container based on the toast type
const getToastClasses = (type: ToastType): string => {
  const baseClasses = 'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1'
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-100 dark:bg-green-800 ring-green-400 dark:ring-green-500`
    case 'error':
      return `${baseClasses} bg-red-100 dark:bg-red-800 ring-red-400 dark:ring-red-500`
    case 'warning':
      return `${baseClasses} bg-yellow-100 dark:bg-yellow-800 ring-yellow-400 dark:ring-yellow-500`
    default:
      return `${baseClasses} bg-blue-100 dark:bg-blue-800 ring-blue-400 dark:ring-blue-500`
  }
}

// Function to get CSS classes for the toast icon based on the toast type
const getIconClasses = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'text-green-500 dark:text-green-400'
    case 'error':
      return 'text-red-500 dark:text-red-400'
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400'
    default:
      return 'text-blue-500 dark:text-blue-400'
  }
}

// Function to get the icon character based on the toast type
const getIcon = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '!'
    default:
      return 'i'
  }
}
</script>

<template>
  <!-- Container for the toast notifications -->
  <div aria-live="polite" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
    <div class="flex flex-col items-center space-y-4 w-full sm:items-end">
      <!-- Transition group for smooth animations -->
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!-- Render each toast notification -->
        <div v-for="toast in store.toasts" :key="toast.id" :class="getToastClasses(toast.type)">
          <div class="p-4">
            <div class="flex items-start">
              <!-- Toast icon -->
              <div class="flex-shrink-0">
                <div :class="getIconClasses(toast.type)" class="h-6 w-6 flex items-center justify-center rounded-full">
                  {{ getIcon(toast.type) }}
                </div>
              </div>
              <!-- Toast message -->
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ toast.message }}
                </p>
              </div>
              <!-- Close button -->
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="() => store.remove(toast.id)"
                  class="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>