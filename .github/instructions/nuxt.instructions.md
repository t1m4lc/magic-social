---
applyTo: "**/*.vue,**/*.ts,**/nuxt.config.*"
---
# Nuxt.js Development Guidelines

## General Principles
- Use Nuxt 3 composition API with `<script setup>` for all components
- Follow Vue 3's best practices for reactivity and component design
- Leverage Nuxt auto-imports for composables and components
- Respect the Nuxt directory structure conventions

## File Organization
- Place components in the `components/` directory
- Keep pages in the `pages/` directory for automatic routing
- Use `composables/` for shared composition functions
- Implement server routes in `server/` directory
- Store layouts in `layouts/` directory
- Use the `middleware/` directory for navigation guards

## TypeScript Usage
- Use TypeScript for all new code
- Define proper interfaces and types for component props
- Leverage Nuxt's type helpers like `defineProps`, `defineEmits` and `definePageMeta`
- Export types from dedicated type files when shared across components

## Data Fetching
- Use `useFetch` or `useAsyncData` for data fetching
- Apply proper error handling for all async operations
- Implement loading states for better UX
- Consider caching strategies with `useFetch` options

## State Management
- Use `useState` for simple state that needs to be shared across components
- For complex state, use Pinia stores
- Follow SSR-friendly patterns for state management
- Remember that `useState` values are shared between users in SSR context

## Server Routes & API
- Implement server routes in the `server/api` directory
- Use `defineEventHandler` for server endpoints
- Validate input data on the server side
- Apply proper error handling with `createError`
- Use server routes for sensitive operations

## SEO & Meta Tags
- Use `useHead` or `useSeoMeta` for managing meta tags
- Set up proper SEO information for all pages
- Consider dynamic meta tags based on page content
- Implement OpenGraph and Twitter card meta tags for sharing

## Performance
- Implement proper component lazy-loading with `defineAsyncComponent`
- Use Suspense for loading states
- Consider selective hydration for large pages
- Implement proper caching strategies

## Data Tables
- Always use Tanstack Table Vue with the `useVueTable` composable
- Avoid other table libraries or custom table implementations
- Implement proper sorting, filtering, and pagination
- Handle loading and error states in tables

## Examples

### Auto-imports

```typescript
// Auto-imports example - no manual imports needed
<script setup lang="ts">
// useState is auto-imported
const counter = useState('counter', () => 0)

// useRoute is auto-imported
const route = useRoute()

// No need to import ref or computed
const doubled = computed(() => counter.value * 2)

function increment() {
  counter.value++
}
</script>
```

### Data Fetching

```typescript
// Effective data fetching with error and loading states
<script setup lang="ts">
const { data: products, pending, error, refresh } = await useFetch('/api/products', {
  // Cache for 30 seconds on the client side
  key: 'products',
  cache: process.client ? 30 : undefined,
  // Transform the response
  transform: (response) => response.products,
  // Handle errors
  onResponseError: (error) => {
    console.error('Failed to fetch products:', error)
  }
})

// Gracefully handle loading and error states
</script>

<template>
  <div>
    <div v-if="pending" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">
      Failed to load products: {{ error.message }}
      <button @click="refresh">Try Again</button>
    </div>
    <ProductList v-else :products="products" />
  </div>
</template>
```

### Server Routes

```typescript
// server/api/products.ts
export default defineEventHandler(async (event) => {
  // Get query parameters
  const { category, limit } = getQuery(event)
  
  // Validate input
  if (category && typeof category !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Invalid category parameter'
    })
  }
  
  try {
    // Fetch data from database
    const products = await db.product.findMany({
      where: category ? { category } : undefined,
      take: limit ? parseInt(limit as string) : 20
    })
    
    return {
      products,
      count: products.length
    }
  } catch (error) {
    console.error('Database error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products'
    })
  }
})
```

### Composables Pattern

```typescript
// composables/useAuthentication.ts
export const useAuthentication = () => {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const token = useCookie('auth_token')
  
  async function login(credentials: { email: string; password: string }) {
    try {
      const { data, error } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (error) throw new Error(error.message)
      
      user.value = data.user
      token.value = data.token
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }
  
  function logout() {
    user.value = null
    token.value = null
    navigateTo('/login')
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}
```

### Tanstack Table Implementation

```vue
<!-- components/DataTable.vue -->
<script setup lang="ts">
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/vue-table'

// Always use useVueTable from @tanstack/vue-table
import { useVueTable } from '@tanstack/vue-table'

// Define props with proper TypeScript types
const props = defineProps<{
  data: any[]
  columns: ColumnDef<any, any>[]
  initialSorting?: { id: string; desc: boolean }[]
}>()

// Create a reactive search input
const globalFilter = ref('')

// Initialize table with useVueTable
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    }
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  }
})

// Table state
const sorting = ref(props.initialSorting || [])
</script>

<template>
  <div class="w-full">
    <!-- Search filter -->
    <div class="mb-4">
      <input
        v-model="globalFilter"
        placeholder="Search..."
        class="px-3 py-2 border border-gray-300 rounded-md w-full max-w-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in table.getHeaderGroups()[0].headers"
              :key="header.id"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="header.column.getToggleSortingHandler()?.()"
            >
              <div class="flex items-center space-x-1">
                <span>{{ flexRender(header.column.columnDef.header, header.getContext()) }}</span>
                <span v-if="header.column.getIsSorted() === 'asc'">↑</span>
                <span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-gray-50">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >
              {{ flexRender(cell.column.columnDef.cell, cell.getContext()) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700">
          Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="px-3 py-1 border rounded text-sm disabled:opacity-50"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </button>
        <button
          class="px-3 py-1 border rounded text-sm disabled:opacity-50"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
```

### Usage Example

```vue
<!-- pages/users.vue -->
<script setup lang="ts">
import { type ColumnDef } from '@tanstack/vue-table'

// Define your data type
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

// Define table columns
const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => (
      <span
        class={info.getValue() === 'active' ? 'text-green-600' : 'text-red-600'}
      >
        {info.getValue()}
      </span>
    )
  }
]

// Fetch data
const { data: users, pending, error } = await useFetch<User[]>('/api/users')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Users</h1>
    
    <div v-if="pending" class="py-10 text-center">Loading users...</div>
    <div v-else-if="error" class="py-10 text-center text-red-600">
      An error occurred while loading users
    </div>
    <DataTable v-else :data="users" :columns="columns" />
  </div>
</template>
```
