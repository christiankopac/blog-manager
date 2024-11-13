# Overview

## Key Components

### Main Application (App.vue)

- Serves as the main container component
- Manages post selection, search, and modal states
- Handles keyboard shortcuts via useKeyboardNavigation
- Implements error boundary handling

### State Management

- Uses Pinia through usePostsStore
- Handles CRUD operations for posts
- Manages loading states and pending operations
- Implements **optimistic updates**

## Core Features

### Post Management

- Create/Edit posts via PostModal.vue
- Delete posts with confirmation (DeleteConfirmationModal.vue)
- Rich text editing using Quill editor
- Form validation using useFormValidation

### Search & Filtering

- Implements search functionality via usePostSearch
- Debounced search for performance
- Filtering posts by title

### UI/UX

- Responsive design using Tailwind CSS
- System-based dark mode support
- Loading states and animations
- Toast notifications for user feedback
- Keyboard shortcuts for power users

### Backend Integration

- RESTful API with Express.js
- SQLite database for persistence
- TypeScript for type safety
- API endpoints for CRUD operations

