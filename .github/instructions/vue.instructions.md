---
applyTo: "**/*.vue,**/*vue*.*"
---
# Vue.js Development Guidelines

## General Principles
- Use Vue 3 composition API with `<script setup>` for all components
- Follow the single-responsibility principle for components
- Use reactive state management via `ref` and `reactive`
- Apply proper typing for component props and events

## Component Structure
- Organize components logically with clear responsibility boundaries
- Break down complex components into smaller, reusable ones
- Use functional components when appropriate
- Keep template logic simple, move complex logic to computed properties or methods

## Props and Events
- Define props using TypeScript interface or type
- Validate props with proper types and default values
- Use `defineEmits` for typed event emission
- Follow kebab-case for event names and camelCase for event handlers

## Reactivity
- Use `ref` for primitive values and `reactive` for objects
- Apply `computed` for derived state
- Use `watch` and `watchEffect` for side effects
- Be mindful of reactivity caveats with arrays and nested objects
- Use `toRefs` when destructuring reactive objects

## Lifecycle and Composables
- Use lifecycle hooks when needed (`onMounted`, `onBeforeUnmount`, etc.)
- Extract reusable logic into composables
- Follow the naming convention `useXxx` for composable functions
- Properly clean up resources in `onBeforeUnmount`

## Directives and Rendering
- Use `v-if` for conditional rendering and `v-show` for toggling visibility
- Apply `v-for` with `key` for list rendering
- Use `v-model` for two-way binding
- Create custom directives when needed

## Performance Optimization
- Use `shallowRef` and `shallowReactive` for large objects when appropriate
- Apply `v-once` for content that never changes
- Use `v-memo` for memoizing parts of the template
- Consider component lazy-loading for code splitting
- Use `markRaw` for objects that should not be made reactive

## State Management
- Use Pinia for global state management
- Follow the store pattern with actions, state, and getters
- Use composables for local state shared between components
- Consider using `provide`/`inject` for component tree state

## Style Guidelines
- Use scoped styles or CSS modules to prevent style leaking
- Apply consistent class naming conventions
- Use CSS variables for theming and customization
- Consider utility-first CSS frameworks like Tailwind

## Examples

### Component Structure

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
// Props definition with TypeScript
interface Props {
  user: User;
  editable?: boolean;
}

// Use defineProps with type annotation
const props = defineProps<Props>();

// Default values using withDefaults
withDefaults(defineProps<Props>(), {
  editable: false
});

// Emits with TypeScript
const emit = defineEmits<{
  (event: 'update', payload: Partial<User>): void;
  (event: 'delete'): void;
}>();

// Component state
const isEditing = ref(false);
const formData = reactive({ ...props.user });

// Computed properties
const fullName = computed(() => 
  `${props.user.firstName} ${props.user.lastName}`
);

// Methods
function startEditing() {
  if (!props.editable) return;
  isEditing.value = true;
}

function saveChanges() {
  emit('update', formData);
  isEditing.value = false;
}
</script>

<template>
  <div class="user-profile">
    <!-- Conditional rendering -->
    <div v-if="isEditing" class="edit-mode">
      <input v-model="formData.firstName" placeholder="First Name" />
      <input v-model="formData.lastName" placeholder="Last Name" />
      <button @click="saveChanges">Save</button>
      <button @click="isEditing = false">Cancel</button>
    </div>
    
    <div v-else class="view-mode">
      <h2>{{ fullName }}</h2>
      <p>{{ user.email }}</p>
      
      <!-- Only show edit button if editable -->
      <button v-if="editable" @click="startEditing">Edit</button>
      <button v-if="editable" @click="emit('delete')">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* More styling... */
</style>
```

### Composables Example

```typescript
// composables/useSearch.ts
export function useSearch<T>(
  items: Ref<T[]>,
  searchFields: (keyof T)[]
) {
  const searchTerm = ref('');
  const isSearching = ref(false);
  
  const filteredItems = computed(() => {
    const term = searchTerm.value.toLowerCase().trim();
    
    if (!term) return items.value;
    
    isSearching.value = true;
    
    return items.value.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && 
          String(value).toLowerCase().includes(term);
      })
    );
  });
  
  // Debounce search for better performance
  const debouncedSearch = useDebounceFn(
    (term: string) => {
      searchTerm.value = term;
    },
    300
  );
  
  function resetSearch() {
    searchTerm.value = '';
    isSearching.value = false;
  }
  
  return {
    searchTerm,
    isSearching,
    filteredItems,
    debouncedSearch,
    resetSearch
  };
}
```

### Component Lifecycle

```vue
<script setup>
import { onMounted, onBeforeUnmount, onUpdated, watch } from 'vue';

// Component lifecycle
onMounted(() => {
  console.log('Component mounted');
  document.addEventListener('keydown', handleKeyDown);
  loadData();
});

onBeforeUnmount(() => {
  console.log('Component will unmount');
  document.removeEventListener('keydown', handleKeyDown);
  saveUnsavedChanges();
});

onUpdated(() => {
  console.log('Component updated');
});

// Watching reactive state
const searchParams = ref({ query: '', page: 1 });

// Options API style watch
watch(searchParams, (newParams, oldParams) => {
  if (newParams.query !== oldParams.query) {
    // Query changed, reset to page 1
    searchParams.value.page = 1;
  }
  
  // Fetch new results
  fetchResults(newParams);
}, { deep: true });

// Specific property watch
watch(() => searchParams.value.query, (newQuery) => {
  console.log(`Search query changed to "${newQuery}"`);
}, { immediate: true });
</script>
```

### Reactive Anti-patterns and Solutions

```vue
<script setup>
// ❌ ANTI-PATTERN: Losing reactivity
let user = reactive({ name: 'John', age: 30 });

function updateUser() {
  // This breaks reactivity by reassigning the reactive object
  user = { name: 'Jane', age: 28 };
}

// ✅ SOLUTION: Maintain the reactive reference
const user = reactive({ name: 'John', age: 30 });

function updateUser() {
  // Update properties individually
  user.name = 'Jane';
  user.age = 28;
  
  // Or use Object.assign to update multiple properties
  Object.assign(user, { name: 'Jane', age: 28 });
}

// ❌ ANTI-PATTERN: Destructuring reactive objects
const product = reactive({ price: 10, quantity: 2 });
const { price, quantity } = product; // Loses reactivity!

// ✅ SOLUTION: Use toRefs or computed properties
const product = reactive({ price: 10, quantity: 2 });
const { price, quantity } = toRefs(product); // Maintains reactivity

// Or use computed for derived values
const total = computed(() => product.price * product.quantity);
</script>
```
