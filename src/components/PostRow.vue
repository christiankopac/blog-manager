<script setup lang="ts">
import type { Post } from '../types/post'

interface Props {
    post: Post
    index: number
    isSelected: boolean
    isPending: boolean
    activeMenu: number | null
    userName: string
}
defineProps<Props>()

interface Emits {
    (event: 'checkbox-click', mouseEvent: MouseEvent, postId: number, index: number): void
    (event: 'toggle-menu', id: number): void
    (event: 'edit', post: Post): void
    (event: 'delete', id: number): void
}
defineEmits<Emits>()
</script>

<template>
    <!-- Table row for a post -->
    <div class="grid grid-cols-12 text-center sm:grid-cols-12" role="row">
        <!-- Title column with checkbox -->
        <div class="col-span-7 sm:col-span-5 py-4 px-4 text-gray-900 dark:text-white">
            <div class="flex items-start sm:items-center">
                <!-- Checkbox for selecting the post -->
                <div class="w-6 h-6 flex-shrink-0 mr-4">
                    <input 
                        type="checkbox" 
                        :checked="isSelected" 
                        :value="post.id"
                        @click="(event) => $emit('checkbox-click', event, post.id, index)"
                        class="form-checkbox h-4 w-4 text-blue-600 bg-transparent border-gray-300 dark:border-gray-600"
                    >
                </div>
                <!-- Post title with loading spinner if pending -->
                <div class="flex-grow flex justify-center items-center overflow-hidden">
                    <div 
                        v-if="isPending"
                        class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-gray-800 dark:border-t-white rounded-full animate-spin mr-2 flex-shrink-0"
                    ></div>
                    <span :class="{ 'opacity-50': isPending }" class="truncate text-center w-full">
                        {{ post.title }}
                    </span>
                </div>
            </div>
        </div>
        <!-- Description column -->
        <div class="hidden sm:block sm:col-span-5 py-4 px-4">
            <span class="truncate block max-w-full text-gray-600 dark:text-gray-400 text-left">{{ post.body }}</span>
        </div>
        <!-- Author column with menu button -->
        <div class="col-span-5 sm:col-span-2 py-4 px-4 flex items-center">
            <!-- Author name -->
            <div class="hidden sm:block text-gray-500 dark:text-gray-400 truncate flex-grow text-center">
                {{ userName }}
            </div>
            <div class="sm:hidden text-gray-500 dark:text-gray-400 truncate break-words whitespace-normal flex-grow text-center">
                {{ userName }}
            </div>
            <!-- Menu button and dropdown -->
            <div class="relative menu-container ml-2 flex-shrink-0">
                <button 
                    @click.stop="$emit('toggle-menu', post.id)"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
                    title="Options"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
                <!-- Dropdown menu -->
                <div 
                    v-if="activeMenu === post.id"
                    class="absolute right-[-7px] mt-[5px] w-32 bg-white dark:bg-gray-700 shadow-xl z-10"
                >
                    <div class="absolute -top-[8px] right-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white dark:border-b-gray-700"></div>
                    <div class="py-1">
                        <button 
                            @click="$emit('edit', post)"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            Edit
                        </button>
                        <button 
                            @click="$emit('delete', post.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>