## Development Workflow

### Setting up new components

1. Create component file structure:

```bash
mkdir -p src/components/NewComponent
touch src/components/NewComponent/NewComponent.vue
touch src/components/NewComponent/NewComponent.test.ts
```

2. Component template:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// Props interface
interface Props {
  // Define props here
}

// Define props and emits
const props = defineProps<Props>()
const emit = defineEmits<{
  // Define events here
}>()

// Component logic
</script>

<template>
  <!-- Component template -->
</template>
```

## Adding features

1. Create feature branch:

```bash
git checkout -b feature/new-feature
```

2. Update store if needed:

```typescript
// src/stores/posts.ts
export const usePostsStore = defineStore('posts', {
  state: () => ({
    // Add new state
  }),
  actions: {
    // Add new actions
    async newFeature() {
      // Implementation
    }
  }
})
```

3. Add composable if needed:

```typescript
// src/composables/useNewFeature.ts
export function useNewFeature() {
  // Feature logic
}
```

## Debugging issues 

1. VS Code launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Vue",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

2. Add debugging points:

```typescript
console.log('Debug:', variableToCheck)
debugger // Browser breakpoint
```