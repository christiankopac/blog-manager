<script setup lang="ts">
defineProps<{
  isLoading: boolean
  selectedCount: number
}>()

defineEmits<{
  'create': []
  'delete-selected': []
}>()
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
</template>