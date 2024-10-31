<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Post, User } from '../types'
import { useFormValidation } from '../composables/useFormValidation'
import { useFormSubmit } from '../composables/useFormSubmit'

interface Props {
  post: Post | null
  users: User[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [data: { title: string; body: string; userId: number }]
}>()

const formData = ref({
  title: props.post?.title || '',
  body: props.post?.body || '',
  userId: props.post?.userId || ''
})

const quillContent = ref(props.post?.body || '')
watch(quillContent, (newContent) => {
  formData.value.body = newContent
})

const { errors, isValid, touchField, touchAll, resetValidation, setSubmitted } = useFormValidation(formData)
const { isSaving, handleSubmit } = useFormSubmit(emit)

const submitForm = async () => {
  touchAll()
  setSubmitted()

  if (!isValid.value) return

  await handleSubmit({
    title: formData.value.title,
    body: formData.value.body,
    userId: Number(formData.value.userId)
  }, props.post?.id)
}

const editorOptions = {
  theme: 'bubble',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote'],
      [{ 'header': [1, 2, 3, false] }],
      ['clean']
    ]
  },
  placeholder: 'Write your post content here...'
}

const closeModal = () => {
  resetValidation()
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 overflow-y-auto" style="z-index: 50;" role="dialog" aria-modal="true"
    aria-labelledby="modal-title" @keydown.esc="closeModal()">
    <div class="fixed inset-0 bg-gray-900/30 dark:bg-black/50 backdrop-blur-sm" @click="closeModal()" />

    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="relative bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" class="text-xl font-medium text-gray-900 dark:text-white">
            {{ props.post ? 'Edit' : 'Create' }} blog entry
          </h2>
        </div>

        <form @submit.prevent="submitForm" class="p-6">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Title
            </label>
            <input id="title" type="text" v-model="formData.title" @blur="touchField('title')"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-md border text-gray-900 dark:text-white"
              :class="[
                errors.title
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
              ]" />
            <p v-if="errors.title" id="title-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.title }}
            </p>
          </div>

          <div class="mb-4">
            <label for="author" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Author
            </label>
            <select id="author" v-model="formData.userId" @blur="touchField('userId')"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-md border text-gray-900 dark:text-white appearance-none"
              :class="[
                errors.userId
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
              ]">
              <option value="">Select an author</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <p v-if="errors.userId" id="author-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.userId }}
            </p>
          </div>

          <div class="mb-6">
            <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Body
            </label>
            <Suspense>
              <QuillEditor v-model:content="quillContent" :options="editorOptions" contentType="text"
                placeholder="Write your post content here..." @blur="touchField('body')"
                class="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <template #fallback>
                <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              </template>
            </Suspense>
            <p v-if="errors.body" id="body-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.body }}
            </p>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeModal" :disabled="isSaving" aria-label="Close"
              class="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              Close
            </button>
            <button type="submit" :disabled="isSaving" 
              class="px-4 py-2 bg-blue-600 dark:bg-blue-500 rounded-lg 
                     text-white hover:bg-blue-700 dark:hover:bg-blue-600 
                     transition-colors duration-200 whitespace-nowrap font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     relative" 
              aria-label="Save Changes">
              <span :class="{ 'opacity-0': isSaving }">Save Changes</span>
              <div v-if="isSaving" class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div class="w-5 h-5 border-2 border-blue-300 dark:border-blue-200
                     border-t-white rounded-full animate-spin">
                </div>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.ql-editor {
  border: 1px solid transparent;
  font-size: 16px;
  font-family: 'Outfit', sans-serif;
}

.ql-tooltip.ql-hidden {
  display: none !important;
}

.ql-editor .ql-toolbar button {
  color: white !important;
}

.ql-editor .ql-toolbar button svg path {
  stroke: white !important;
}

.ql-editor .ql-toolbar button.ql-active svg path,
.ql-editor .ql-toolbar button:hover svg path {
  stroke: #FFF !important;
}

.ql-editor .ql-toolbar .ql-picker {
  color: white !important;
}

.ql-editor.ql-blank::before {
  font-family: 'Roboto', sans-serif !important;
  font-size: 16px !important;
  color: #6B7280 !important;
  font-style: normal !important;
}

.ql-container.ql-snow,
.ql-toolbar.ql-snow {
  border-color: rgb(209, 213, 219) !important;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 0.5rem !important;
  border-top-right-radius: 0.5rem !important;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 0.5rem !important;
  border-bottom-right-radius: 0.5rem !important;
}

@media (prefers-color-scheme: dark) {
  .ql-editor.ql-blank::before {
    color: white !important;
  }

  .ql-container.ql-snow,
  .ql-toolbar.ql-snow {
    border-color: rgb(75, 85, 99) !important;
  }
}
</style>