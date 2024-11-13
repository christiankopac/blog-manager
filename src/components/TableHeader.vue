<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Define the props for the component
interface Props {
  allPostsSelected: boolean
}
defineProps<Props>()

// Define the emits for the component
type Emits = (event: 'toggle-select-all') => void
defineEmits<Emits>()
</script>

<template>
  <!-- Table header row -->
  <div class="grid grid-cols-12 text-center text-xs uppercase sm:grid-cols-12" role="row">
    <!-- Title column with select all checkbox -->
    <div class="col-span-8 sm:col-span-5 py-4 px-4 text-gray-900 dark:text-white font-semibold tracking-wider">
      <div class="flex items-center">
        <!-- Select all checkbox -->
        <div class="w-6 h-6 flex-shrink-0 mr-2 flex items-center justify-center">
          <input 
            type="checkbox" 
            :checked="allPostsSelected" 
            @change="$emit('toggle-select-all')"
            class="form-checkbox h-4 w-4 text-blue-600 bg-transparent border-gray-300 dark:border-gray-600"
          >
        </div>
        <!-- Title text -->
        <span class="truncate flex-grow text-center">Title</span>
      </div>
    </div>
    <!-- Description column -->
    <div class="hidden sm:block sm:col-span-5 py-4 text-gray-900 dark:text-white font-semibold tracking-wider">
      Description
    </div>
    <!-- Author column -->
    <div class="col-span-4 sm:col-span-2 py-4 text-gray-900 dark:text-white font-semibold tracking-wider flex justify-center items-center">
      <span class="truncate">Author</span>
      <div class="w-5 h-5 ml-2"></div>
    </div>
  </div>
</template>