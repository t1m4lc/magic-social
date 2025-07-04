---
applyTo: "**/*.css,**/*tailwind*.*,**/*.vue"
---
# Tailwind CSS Development Guidelines

## General Principles
- Follow the utility-first approach for styling
- Use Tailwind's utility classes directly in HTML/JSX/Vue templates
- Apply consistent spacing and sizing using Tailwind's scale
- Leverage Tailwind's responsive design utilities

## Class Organization
- Group related utility classes together
- Order classes logically (layout → box model → typography → visual)
- Use multi-line format for elements with many classes
- Consider extracting common patterns with `@apply` in component styles
- Use Prettier with the Tailwind CSS plugin for automatic class sorting
- Follow the official guideline from https://tailwindcss.com/blog/automatic-class-sorting-with-prettier

## Class Sorting with Prettier
- Always use the official Tailwind CSS Prettier plugin
- The plugin automatically sorts classes according to Tailwind's recommended order
- This ensures consistency across all templates
- Classes are grouped in the following order:
  1. Layout (position, display, etc.)
  2. Box model (width, height, margin, padding)
  3. Typography (font, text, etc.)
  4. Visual (colors, backgrounds, borders)
  5. Interactions (hover, focus, etc.)
  6. Miscellaneous

## Installation
```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

## Configuration
Create or update `.prettierrc` at the project root:
```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2
}
```

## Responsive Design
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Design mobile-first, then add responsive variants
- Apply consistent breakpoints across the application
- Test responsive layouts on various device sizes

## Custom Extensions
- Extend Tailwind's theme in the configuration file
- Use semantic names for custom colors and spacing
- Create custom utilities only when necessary
- Maintain consistency with Tailwind's naming conventions

## Dark Mode
- Use Tailwind's dark mode utilities (`dark:`)
- Apply consistent dark mode styling across the application
- Consider user preferences with `prefers-color-scheme`
- Test both light and dark modes thoroughly

## Component Patterns
- Extract common UI patterns into reusable components
- Use consistent class patterns for similar elements
- Consider using shadcn/ui as a foundation for components
- Document component usage and available customizations

## Performance
- Use PurgeCSS in production to remove unused utility classes
- Consider using `@layer` for proper CSS organization
- Apply code splitting for CSS when appropriate
- Use modern CSS features supported by Tailwind

## Accessibility
- Use appropriate color contrast ratios
- Apply proper focus styles for interactive elements
- Use semantic HTML elements with appropriate Tailwind utilities
- Test with screen readers and keyboard navigation

## Animation and Transitions
- Use Tailwind's transition utilities for animations
- Apply consistent timing functions and durations
- Consider using motion-safe/motion-reduce utilities for accessibility
- Use animation sparingly and purposefully

## Examples

### Component Styling

```vue
<!-- Card.vue -->
<template>
  <!-- Card with responsive design and variants -->
  <div 
    :class="[
      'overflow-hidden rounded-lg shadow-md transition-all duration-200',
      {
        'bg-white': variant === 'default',
        'bg-primary-50 border border-primary-200': variant === 'primary',
        'bg-gray-50 border border-gray-200': variant === 'secondary',
        'hover:shadow-lg': interactive
      }
    ]"
  >
    <!-- Card header with flex layout -->
    <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      
      <slot name="actions" />
    </div>
    
    <!-- Card content with responsive padding -->
    <div class="p-4 sm:p-6">
      <slot />
    </div>
    
    <!-- Card footer, shown conditionally -->
    <div 
      v-if="$slots.footer" 
      class="px-6 py-3 bg-gray-50 flex justify-end space-x-2"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'secondary'].includes(v)
  },
  interactive: {
    type: Boolean,
    default: false
  }
});
</script>
```

### Responsive Layout Example

```vue
<!-- DashboardLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Responsive navbar -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo & mobile menu button -->
          <div class="flex items-center">
            <button 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" 
              @click="isSidebarOpen = !isSidebarOpen"
            >
              <span class="sr-only">Open sidebar</span>
              <MenuIcon v-if="!isSidebarOpen" class="h-6 w-6" />
              <XIcon v-else class="h-6 w-6" />
            </button>
            
            <div class="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <img class="h-8 w-auto" src="/logo.svg" alt="Logo" />
            </div>
          </div>
          
          <!-- User dropdown & notifications -->
          <div class="flex items-center">
            <button class="p-2 text-gray-400 hover:text-gray-500">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" />
            </button>
            
            <!-- Profile dropdown -->
            <div class="ml-4 relative flex-shrink-0">
              <!-- Profile dropdown implementation -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar & main content layout -->
    <div class="flex">
      <!-- Mobile sidebar backdrop -->
      <div 
        v-if="isSidebarOpen" 
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        @click="isSidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:z-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- Sidebar content -->
        <nav class="mt-5 px-2 space-y-1">
          <a 
            v-for="item in navigation" 
            :key="item.name"
            :href="item.href"
            :class="[
              item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
            ]"
          >
            <component :is="item.icon" 
              :class="[
                item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-4 flex-shrink-0 h-6 w-6'
              ]" 
            />
            {{ item.name }}
          </a>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  MenuIcon, XIcon, BellIcon,
  HomeIcon, UsersIcon, FolderIcon, CalendarIcon, ChartBarIcon
} from '@heroicons/vue/outline';

const isSidebarOpen = ref(false);

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
];
</script>
```

### Custom Utility Patterns

```css
/* tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes using @apply */
@layer components {
  /* Primary button with different states */
  .btn-primary {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
  }
  
  /* Secondary button */
  .btn-secondary {
    @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
  }
  
  /* Form input with consistent styling */
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
  }
  
  /* Card container */
  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
}

/* Custom utilities */
@layer utilities {
  /* Grid layouts for different card counts */
  .grid-cards-1 {
    @apply grid grid-cols-1 gap-4;
  }
  
  .grid-cards-2 {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
  }
  
  .grid-cards-3 {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
  }
  
  /* Animation utilities */
  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
}

/* Custom animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Responsive Design Best Practices

```vue
<!-- ResponsiveTable.vue -->
<template>
  <div>
    <!-- Responsive table design pattern -->
    
    <!-- On mobile: cards layout -->
    <div class="block sm:hidden space-y-4">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="bg-white p-4 rounded-lg shadow"
      >
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Name</span>
            <span class="font-medium">{{ item.name }}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Email</span>
            <span>{{ item.email }}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Status</span>
            <span 
              :class="[
                'px-2 py-1 text-xs rounded-full',
                item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ item.status }}
            </span>
          </div>
          
          <div class="flex justify-end pt-2">
            <button class="btn-secondary text-xs py-1">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- On desktop: normal table -->
    <div class="hidden sm:block">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ item.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button class="btn-secondary text-xs py-1">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
```
