<script setup lang="ts">
defineProps<{
  isLoading: boolean
  selectedCount: number
  showDeleteModal: boolean
}>()

const emit = defineEmits<{
  'create': []
  'delete-selected': []
  'close': []
  'confirm': []
}>()

// Emit close event
const onClose = () => emit('close')

// Emit confirm event
const onConfirm = () => emit('confirm')
</script>

<template>
  <div class="flex flex-row gap-2 w-full">
    <button 
      @click="$emit('create')" 
      :disabled="isLoading" 
      class="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 dark:bg-blue-500 rounded-lg 
             text-white hover:bg-blue-700 dark:hover:bg-blue-600 
             transition-colors duration-200 whitespace-nowrap font-medium
             disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Create new post
    </button>
    <button 
      v-if="selectedCount > 0" 
      @click="$emit('delete-selected')"
      class="flex-grow sm:flex-grow-0 px-4 py-2 bg-red-600 dark:bg-red-500 rounded-lg 
             text-white hover:bg-red-700 dark:hover:bg-red-600 
             transition-colors duration-200 whitespace-nowrap font-medium"
    >
      Delete Selected ({{ selectedCount }})
    </button>
  </div>

  <!-- Modal container -->
  <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <!-- Modal backdrop -->
    <div class="fixed inset-0 bg-gray-900/30 dark:bg-black/50 backdrop-blur-sm" @click="onClose" />
    <!-- Modal content -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto">
        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" class="text-xl font-medium text-gray-900 dark:text-white">
            Confirm Delete
          </h2>
        </div>
        <!-- Modal body -->
        <div class="p-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <!-- Modal actions -->
          <div class="flex justify-end gap-4">
            <button @click="onClose" class="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button @click="onConfirm" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>