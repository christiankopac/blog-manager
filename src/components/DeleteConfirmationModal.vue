<template>
  <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="fixed inset-0 bg-gray-900/30 dark:bg-black/50 backdrop-blur-sm" @click="onClose" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" class="text-xl font-medium text-gray-900 dark:text-white">
            Confirm Delete
          </h2>
        </div>
        <div class="p-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
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

<script setup lang="ts">
defineProps<{
  showDeleteModal: boolean
}>()

const emit = defineEmits<{
  close: [],
  confirm: []
}>()

const onClose = () => emit('close')
const onConfirm = () => emit('confirm')
</script>
