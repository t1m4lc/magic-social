---
applyTo: "**/*.ts,**/*.tsx,**/*.d.ts"
---
# TypeScript Development Guidelines

## General Principles
- Use TypeScript's strict mode for enhanced type safety
- Prefer interfaces for object shapes that will be extended
- Use type aliases for unions, primitives, and tuples
- Leverage TypeScript's type inference when appropriate
- Document complex types with JSDoc comments

## Type Definitions
- Use specific types rather than `any` whenever possible
- Create reusable type definitions in dedicated files
- Use generics for flexible and reusable code
- Apply consistent naming conventions for types and interfaces
- Use intersection types (`&`) to combine types instead of inheritance when appropriate

## Type Manipulation
- Leverage utility types like `Partial<T>`, `Pick<T>`, `Omit<T>`, etc.
- Use mapped types for transforming object types
- Apply conditional types for advanced type logic
- Use template literal types for string manipulation
- Be familiar with indexed access types for property access

## Function Types
- Define explicit return types for functions with complex logic
- Use function overloads for functions with multiple signatures
- Apply proper typing for callbacks and higher-order functions
- Use the `Parameters<T>` and `ReturnType<T>` utility types when needed

## Error Handling
- Use discriminated unions for error types
- Leverage `try`/`catch` with typed catch clauses
- Create custom error classes with proper typing
- Consider using the `Result` pattern (Ok/Error) for recoverable errors

## Type Guards and Narrowing
- Implement proper type guards with `is` return type
- Use exhaustiveness checking with discriminated unions
- Apply narrowing with conditional checks
- Leverage `instanceof` for class-based type checking
- Use `in` operator for property existence checks

## Module Management
- Use ES modules with explicit imports and exports
- Organize types in logical modules
- Consider barrel files (`index.ts`) for grouping related exports
- Use path aliases for cleaner imports
- Be mindful of circular dependencies

## Advanced Features
- Use namespaces sparingly and only for specific use cases
- Apply declaration merging when extending existing types
- Use const assertions for literal types
- Consider using `satisfies` operator for type validation without widening
- Use `as const` for readonly array and object literals

## Examples

### Type Definitions

```typescript
// Domain-specific types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'viewer';
  preferences?: UserPreferences;
  createdAt: Date;
}

// Use discriminated unions for state management
type RequestState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Generic types
interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Helper type utilities
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Modify<T, R> = Omit<T, keyof R> & R;
```

### Type Manipulation

```typescript
// Utility type examples
type UserWithoutId = Omit<User, 'id'>;
type UserForCreation = Pick<User, 'email' | 'firstName' | 'lastName' | 'role'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;

// Mapped types
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Conditional types
type ExtractIdType<T> = T extends { id: infer U } ? U : never;
type UserId = ExtractIdType<User>; // string

// Template literal types
type CSSProperty = `${string}-${'top' | 'right' | 'bottom' | 'left'}`; // e.g. "padding-top"
type EventName<T extends string> = `on${Capitalize<T>}`; // e.g. "onClick"
```

### Error Handling

```typescript
// Error class hierarchy
class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(
    message: string, 
    public readonly field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Result pattern
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };

function validate(input: unknown): Result<User> {
  if (!input || typeof input !== 'object') {
    return { 
      success: false, 
      error: new ValidationError('Input must be an object') 
    };
  }
  
  // More validation logic...
  
  return { success: true, value: input as User };
}

// Using the Result type
function processUser(userData: unknown): void {
  const result = validate(userData);
  
  if (result.success) {
    // Use the validated user
    saveUser(result.value);
  } else {
    // Handle the error
    logError(result.error);
  }
}
```

### Type Guards

```typescript
// Type guard functions
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).email === 'string'
  );
}

// Array type guard
function isUserArray(value: unknown): value is User[] {
  return (
    Array.isArray(value) &&
    (value.length === 0 || isUser(value[0]))
  );
}

// Exhaustiveness checking
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return 0.5 * shape.base * shape.height;
    default:
      // Exhaustiveness check using a never type
      const _exhaustiveCheck: never = shape;
      throw new Error(`Unhandled shape kind: ${_exhaustiveCheck}`);
  }
}
```
