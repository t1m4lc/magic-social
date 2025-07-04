---
applyTo: "**/server/**,**/server.*,**/nitro.config.*"
---
# Nitro Server Development Guidelines

## General Principles
- Use the `defineEventHandler` for API endpoint definition
- Follow RESTful design principles for API routes
- Implement proper error handling with `createError`
- Use typed request and response objects

## Route Organization
- Organize routes in logical directory structure
- Use dynamic route parameters with proper validation
- Group related functionality in dedicated directories
- Implement reusable middleware where appropriate

## Data Handling
- Validate all incoming data using schema validation (Zod, Joi, etc.)
- Use `readBody`, `getQuery`, and `getRouterParams` to extract request data
- Properly type the response data
- Handle file uploads with proper validation and virus scanning

## Middleware
- Use `defineNitroPlugin` for global middleware
- Create reusable middleware for common operations (auth, logging, etc.)
- Apply middleware selectively based on route patterns
- Keep middleware functions focused on a single responsibility

## Error Handling
- Use `createError` with appropriate status codes
- Provide meaningful error messages without exposing sensitive information
- Implement proper error logging
- Consider global error handling for consistent responses

## Tasks
- Use Nitro tasks for background operations
- Define tasks in the `server/tasks` directory
- Properly type task parameters and return values
- Implement scheduled tasks for recurring operations

## Caching
- Use Nitro's caching capabilities for expensive operations
- Implement proper cache invalidation strategies
- Consider cache TTL based on data volatility
- Use cache tags for grouped invalidation when appropriate

## Storage
- Use Nitro's storage abstraction for persistence
- Implement proper error handling for storage operations
- Apply appropriate namespacing for storage keys
- Consider using different storage drivers based on environment

## Database Integration
- Use Nitro's database drivers where appropriate
- Implement connection pooling for database connections
- Properly handle database errors
- Use prepared statements for all database queries
- Close connections properly to avoid resource leaks

## Examples

### API Routes

```typescript
// server/api/users/[id].ts
export default defineEventHandler(async (event) => {
  // Get route parameters
  const id = getRouterParam(event, 'id')
  
  // Validate parameters
  if (!id || !/^\d+$/.test(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }
  
  try {
    // Get user from database
    const user = await getUserById(parseInt(id))
    
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }
    
    return user
  } catch (error) {
    // Handle database errors
    console.error(`Error fetching user #${id}:`, error)
    
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
```

### Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // Skip authentication for public routes
  if (
    event.path.startsWith('/api/auth') ||
    event.path === '/api/health'
  ) {
    return
  }
  
  // Get the Authorization header
  const authorization = getRequestHeader(event, 'authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Missing or invalid token'
    })
  }
  
  const token = authorization.substring(7)
  
  try {
    // Verify the token
    const user = await verifyToken(token)
    
    // Attach user to event context for downstream handlers
    event.context.user = user
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token'
    })
  }
})
```

### Task Example

```typescript
// server/tasks/db/cleanup.ts
export default defineTask({
  meta: {
    name: 'db:cleanup',
    description: 'Clean up expired sessions and temporary data'
  },
  async run({ payload, context }) {
    console.log('Starting database cleanup task...')
    
    try {
      // Delete expired sessions
      const { deletedSessions } = await deleteExpiredSessions()
      console.log(`Deleted ${deletedSessions} expired sessions`)
      
      // Clean up temporary uploads
      const { deletedFiles } = await cleanupTempUploads()
      console.log(`Cleaned up ${deletedFiles} temporary files`)
      
      return {
        success: true,
        stats: {
          deletedSessions,
          deletedFiles
        }
      }
    } catch (error) {
      console.error('Error during cleanup task:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
})
```

### Cache Example

```typescript
// server/api/products/featured.ts
export default defineCachedEventHandler(
  async (event) => {
    console.log('Fetching featured products...')
    
    // Simulate database call
    const products = await fetchFeaturedProducts()
    
    return {
      products,
      timestamp: new Date().toISOString()
    }
  },
  {
    // Cache for 5 minutes
    maxAge: 300,
    // Use stale cache while revalidating
    staleWhileRevalidate: 60,
    // Cache key generation
    getKey: (event) => {
      const lang = getRequestHeader(event, 'accept-language') || 'en'
      return `featured-products-${lang.substring(0, 2)}`
    },
    // Cache groups for invalidation
    group: 'products'
  }
)
```
