<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { usePostsStore } from './stores/posts'
import { usePostSearch } from './composables/usePostSearch'
import { usePostAction } from './composables/usePostAction'
import { usePostModal } from './composables/usePostModal'
import { useKeyboardNavigation } from './composables/useKeyboardNavigation'
import { useErrorBoundary } from './composables/useErrorBoundary'
import PostModal from './components/PostModal.vue'
import DeleteConfirmationModal from './components/DeleteConfirmationModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import SearchBar from './components/SearchBar.vue'
import ActionButtons from './components/ActionButtons.vue'
import TableHeader from './components/TableHeader.vue'
import PostRow from './components/PostRow.vue'
import type { Post } from './types'


const appTitle = import.meta.env.VITE_APP_TITLE
const store = usePostsStore()

const { error, resetError } = useErrorBoundary()
const { showModal, selectedPost, openCreateModal, openEditModal, closeModal } = usePostModal()
const { searchQuery, filteredPosts } = usePostSearch(store)
const { savePost } = usePostAction(store)

const showDeleteModal = ref(false)
const postToDelete = ref<number | null>(null)

const openDeleteModal = (id: number) => {
  postToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  postToDelete.value = null
}

const confirmDelete = async () => {
  if (postToDelete.value !== null) {
    await store.deletePost(postToDelete.value)
    closeDeleteModal()
  }
}

useKeyboardNavigation({
  escape: () => {
    if (showModal.value) closeModal()
    if (showDeleteModal.value) closeDeleteModal()
  },
  enter: () => {
    if (!showModal.value && !showDeleteModal.value) openCreateModal()
  }
})

const fetchData = async () => {
  try {
    await store.fetchData()
  } catch (err) {
    error.value = err as Error
  }
}

onMounted(fetchData)

const selectedPosts = ref<number[]>([])
const allPostsSelected = computed(() => selectedPosts.value.length === filteredPosts.value.length)

const deleteSelectedPosts = async () => {
  await store.deletePosts(selectedPosts.value)
  selectedPosts.value = []
}

const activeMenu = ref<number | null>(null)
const toggleMenu = (id: number) => {
  activeMenu.value = activeMenu.value === id ? null : id
}

const closeActiveMenu = (event: MouseEvent) => {
  if (activeMenu.value !== null) {
    const target = event.target as HTMLElement
    if (!target.closest('.menu-container')) {
      activeMenu.value = null
    }
  }
}

const lastCheckedIndex = ref<number | null>(null)
const handleCheckboxClick = (event: MouseEvent, postId: number, index: number) => {
  if (event.shiftKey && lastCheckedIndex.value !== null) {
    const start = Math.min(lastCheckedIndex.value, index)
    const end = Math.max(lastCheckedIndex.value, index)

    const shouldSelect = !selectedPosts.value.includes(postId)

    const newSelectedPosts = selectedPosts.value.filter(id => {
      const postIndex = filteredPosts.value.findIndex(post => post.id === id)
      return postIndex < start || postIndex > end
    })

    if (shouldSelect) {
      for (let i = start; i <= end; i++) {
        const currentPostId = filteredPosts.value[i].id
        newSelectedPosts.push(currentPostId)
      }
    }

    selectedPosts.value = newSelectedPosts
  } else {
    selectedPosts.value = selectedPosts.value.includes(postId)
      ? selectedPosts.value.filter(id => id !== postId)
      : [...selectedPosts.value, postId]
  }

  lastCheckedIndex.value = index
}

const toggleSelectAll = () => {
  selectedPosts.value = allPostsSelected.value ? [] : filteredPosts.value.map(post => post.id)
  lastCheckedIndex.value = null
}

onMounted(() => {
  document.addEventListener('click', closeActiveMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActiveMenu)
})

const handleEdit = (post: Post) => {
  activeMenu.value = null
  openEditModal(post)
}

const handleDelete = (id: number) => {
  activeMenu.value = null
  openDeleteModal(id)
}
</script>

<template>
  <div v-if="error" class="fixed inset-0 z-50 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error.message }}</p>
      <button @click="resetError" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Try Again
      </button>
    </div>
  </div>
  <div class="min-h-screen h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
    <header class="shrink-0 px-4 sm:px-6 py-4 bg-gray-800 dark:bg-gray-800 border-b dark:border-gray-700">
      <div class="max-w-screen-xl mx-auto">
        <h1 class="text-2xl font-bold text-white">{{ appTitle }}</h1>
      </div>
    </header>

    <main role="main" class="flex-1 flex flex-col px-2 sm:px-6 py-4 min-h-0">
      <div class="max-w-screen-xl mx-auto w-full h-full flex flex-col">
        <div class="shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 w-full">
          <label for="search-posts" class="sr-only">Search posts</label>
          <div class="flex-1">
            <SearchBar 
              v-model="searchQuery" 
              :is-loading="store.isLoading" 
            />
          </div>
          <div class="w-full sm:w-auto">
            <ActionButtons 
              :is-loading="store.isLoading" 
              :selected-count="selectedPosts.length" 
              @create="openCreateModal" 
              @delete-selected="deleteSelectedPosts" 
            />
          </div>
        </div>
        
        <div v-if="store.error && !store.isLoading && filteredPosts.length > 0" role="alert" class="relative px-4 py-3 bg-red-100 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400">
          {{ store.error }}
          <button @click="store.error = null" class="absolute top-2 right-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
            <span class="sr-only">Dismiss</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="flex-1 flex flex-col min-h-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <TableHeader :all-posts-selected="allPostsSelected" @toggle-select-all="toggleSelectAll" />

          <div class="flex-1 overflow-auto">
            <div v-if="store.isLoading" class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="n in 5" :key="n" class="grid grid-cols-11 animate-pulse sm:grid-cols-11">
                <div class="col-span-8 sm:col-span-4 py-4 px-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div class="hidden sm:block sm:col-span-5 py-4 px-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div class="col-span-3 sm:col-span-2 py-4 px-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div v-else-if="filteredPosts.length === 0" class="flex-1">
              <div class="flex items-center justify-center h-64">
                <p class="text-gray-500 dark:text-gray-400">
                  {{ searchQuery ? 'No posts found matching your search.' : 'No posts available.' }}
                </p>
              </div>
            </div>

            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="(post, index) in filteredPosts" :key="post.id" :class="[
                'transition-colors duration-150',
                index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700',
                'hover:bg-gray-200 dark:hover:bg-gray-500'
              ]">
                <PostRow 
                  :post="post" 
                  :index="index" 
                  :is-selected="selectedPosts.includes(post.id)"
                  :is-pending="store.isPostPending(post.id)" 
                  :active-menu="activeMenu"
                  :user-name="store.users.find(user => user.id === post.userId)?.name || ''" 
                  @checkbox-click="handleCheckboxClick"
                  @edit="handleEdit"
                  @delete="handleDelete"
                  @toggle-menu="toggleMenu"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Teleport to="body">
      <Transition 
        enter-active-class="ease-out duration-300" 
        enter-from-class="opacity-0" 
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <PostModal 
          v-if="showModal" 
          :post="selectedPost" 
          :users="store.users" 
          @close="closeModal" 
          @save="savePost" 
        />
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition 
        enter-active-class="ease-out duration-300" 
        enter-from-class="opacity-0" 
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <DeleteConfirmationModal 
          v-if="showDeleteModal" 
          :showDeleteModal="showDeleteModal" 
          @close="closeDeleteModal"
          @confirm="confirmDelete" 
        />
      </Transition>
    </Teleport>
    <ToastContainer />
  </div>
</template>

<style scoped>
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
