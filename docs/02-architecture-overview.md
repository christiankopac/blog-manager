### Architecture Overview

#### Frontend Structure

The application is built using Vue 3 with TypeScript and is organized into several key areas:

#### Core Components

`App.vue` - Main container component that handles:
  - Post management (CRUD operations)
  - Selection and bulk actions
  - Search functionality
  - Modal state management
  - Error boundaries

#### State Management

- Uses Pinia through usePostsStore:
```
interface PostsState {
  posts: Post[]
  users: User[]
  isLoading: boolean
  error: string | null
  pendingOperations: Set<number>
  lastAction: string
}
```

#### Composables (Custom Hooks)

- `usePostSearch` - Search functionality with debouncing
- `usePostAction` - Post CRUD operations
- `usePostModal` - Modal management
- `useFormValidation` - Form validation logic

#### UI Components

- `PostModal.vue` - Create/Edit post form
- `DeleteConfirmationModal.vue` - Delete confirmation
- `ToastContainer.vue` - Notification system
- `SearchBar.vue` - Search functionality
- `PostRow.vue` - Individual post display

#### Key Features

**Post Management**
```
// Create/Update posts
const savePost = async (postData: CreatePostData & { id?: number }) => {
  return store.savePost(postData)
}

// Delete posts
const deleteSelectedPosts = async () => {
  await store.deletePosts(selectedPosts.value)
  selectedPosts.value = []
}
```

**Toast Notifications**

```
const toast = useToastStore()
toast.success("Post created successfully")
toast.error("Failed to delete post")
```
