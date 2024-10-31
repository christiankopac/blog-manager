# Blog Manager

## Features

- 📝 Create, read, update, and delete blog posts
- 🔍 Search and filter posts
- 📱 Responsive design with mobile support
- 🌓 Automatic dark mode support
- 🔔 Toast notifications for user feedback
- ✨ Rich text editing with Quill
- 🎯 Keyboard shortcuts for power users

## Tech Stack

### Frontend

- Vue 3 with Composition API
- TypeScript
- Vite
- Pinia for state management
- Tailwind CSS for styling
- Vue Quill for rich text editing
  - Initially I was using [md-editor-v3](https://github.com/imzbf/md-editor-v3) but it was too heavy for this project.

### Backend

- Express.js
- SQLite database
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

Clone the repository

```sh
git clone https://github.com/kro-dev/blog-manager.git
cd blog-manager
```

Install frontend dependencies

```sh
npm install
```

Install backend dependencies

```sh
cd api
npm install
```

### Development

- Start the backend server

```sh
cd api
npm run dev
```

- Start the frontend development server (in a new terminal)

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

- Build the frontend

```sh
npm run build
```

- Add the correct environment variable to the build for production to `.env.production`

- Preview the production build

```sh
npm run preview
```

## Features in Detail

### Post Management

- Create new blog posts with rich text editing
- Edit existing posts
- Delete single or multiple posts
- Search posts by title or content
- Bulk actions support

### User Interface

- Responsive design that works on mobile and desktop
- System-based dark mode support
- Toast notifications for operation feedback
- Confirmation dialogs for destructive actions
- Keyboard shortcuts for common actions

### Performance

- API response caching
- Debounced search
- Optimized bundle splitting
