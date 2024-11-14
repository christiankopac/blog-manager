<script setup lang="ts">
interface Props {
  modelValue: string
  isLoading: boolean
}
defineProps<Props>()

type Emits = (event: 'update:modelValue', value: string) => void
defineEmits<Emits>()
</script>

<template>
  <div class="relative">
    <!-- Search icon -->
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd" />
      </svg>
    </div>
    <!-- Search input field -->
    <input 
      type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" 
      placeholder="Search posts..."
      :disabled="isLoading" 
      class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-full
             text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
             border border-gray-300 dark:border-gray-700
             focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500
             focus:border-blue-500 dark:focus:border-blue-500
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors duration-300 ease-in-out" 
    />
  </div>
</template>