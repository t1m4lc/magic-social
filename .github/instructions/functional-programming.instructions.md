---
applyTo: "**/*.js,**/*.ts, **/*.vue,**/*vue*.*"
---

# Functional Programming Guidelines

## General Principles

- Prefer pure functions without side effects
- Use immutability for data transformation
- Apply function composition for complex operations
- Leverage higher-order functions for abstraction

**Example:**

```typescript
// Pure function with no side effects
const calculateTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.price, 0);

// Immutable data transformation
const addItem = (items: Item[], newItem: Item): Item[] => [...items, newItem];

// Function composition
const processOrder = pipe(
  validateOrder,
  calculateTotal,
  applyDiscount,
  generateInvoice
);
```

## Function Design

- Keep functions small and focused on a single responsibility
- Use meaningful parameter and function names
- Apply proper typing for function parameters and return values
- Consider currying for partial application

**Example:**

```typescript
// Single responsibility function with meaningful name
const filterActiveUsers = (users: User[]): User[] =>
  users.filter((user) => user.isActive);

// Properly typed function
const calculateDiscount = (amount: number, rate: number): number =>
  amount * rate;

// Curried function for partial application
const formatCurrency =
  (currency: string) =>
  (amount: number): string =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount
    );

const formatUSD = formatCurrency("USD");
const formatEUR = formatCurrency("EUR");
```

## Immutability

- Treat data as immutable
- Use spread operators and destructuring for object/array manipulation
- Apply methods like `map`, `filter`, and `reduce` instead of loops
- Consider using immutable data libraries for complex state

**Example:**

```typescript
// Immutable object update
const updateUser = (user: User, updates: Partial<User>): User => ({
  ...user,
  ...updates,
});

// Immutable array operations
const removeItem = (items: Item[], id: string): Item[] =>
  items.filter((item) => item.id !== id);

const updateItem = (
  items: Item[],
  id: string,
  updates: Partial<Item>
): Item[] =>
  items.map((item) => (item.id === id ? { ...item, ...updates } : item));

// Using reduce instead of imperative loops
const groupByCategory = (products: Product[]): Record<string, Product[]> =>
  products.reduce((groups, product) => {
    const category = product.category;
    return {
      ...groups,
      [category]: [...(groups[category] || []), product],
    };
  }, {});
```

## Error Handling

- Use functional error handling patterns
- Consider the Either/Result pattern for error cases
- Apply monadic error handling when appropriate
- Use type-based error handling with discriminated unions

**Example:**

```typescript
// Result type for functional error handling
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Function that returns a Result
const divideNumbers = (a: number, b: number): Result<number> => {
  if (b === 0) {
    return { success: false, error: new Error("Division by zero") };
  }
  return { success: true, value: a / b };
};

// Using the Result type
const performCalculation = (a: number, b: number): void => {
  const result = divideNumbers(a, b);

  if (result.success) {
    console.log(`Result: ${result.value}`);
  } else {
    console.error(`Error: ${result.error.message}`);
  }
};

// Discriminated union for type-based error handling
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; code: number; message: string }
  | { status: "loading" };
```

## Composition

- Use function composition to build complex operations
- Apply the pipe pattern for readable data transformations
- Create reusable composition utilities
- Consider point-free style when it improves readability

**Example:**

```typescript
// Simple compose utility
const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (initialValue: T): T =>
    fns.reduceRight((value, fn) => fn(value), initialValue);

// Pipe utility (left-to-right composition)
const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (initialValue: T): T =>
    fns.reduce((value, fn) => fn(value), initialValue);

// Using pipe for data transformation
const processUserData = pipe(
  normalizeData,
  validateUser,
  enrichWithMetadata,
  persistToDatabase
);

// Point-free style example
const getCompletedTasks = users
  .flatMap((user) => user.tasks)
  .filter((task) => task.completed);
```

## Higher-Order Functions

- Use higher-order functions for abstraction
- Apply common patterns like `map`, `filter`, `reduce`
- Create custom higher-order functions for domain-specific operations
- Consider the reader pattern for dependency injection

**Example:**

```typescript
// Higher-order function for retry logic
const withRetry = <T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): (() => Promise<T>) => {
  return async () => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await delay(exponentialBackoff(attempt));
        }
      }
    }

    throw lastError;
  };
};

// Reader pattern for dependency injection
type Reader<E, A> = (env: E) => A;

const ask =
  <E>(): Reader<E, E> =>
  (env) =>
    env;

const asks =
  <E, A>(f: (env: E) => A): Reader<E, A> =>
  (env) =>
    f(env);

const runReader = <E, A>(reader: Reader<E, A>, env: E): A => reader(env);
```

## Recursion

- Use recursion for tree-like data structures
- Apply tail recursion when possible
- Consider trampolines for deep recursion in JavaScript
- Provide proper base cases to prevent infinite recursion

**Example:**

```typescript
// Regular recursion for tree traversal
type TreeNode = {
  value: number;
  children?: TreeNode[];
};

const sumTreeValues = (node: TreeNode): number => {
  let sum = node.value;

  if (node.children) {
    for (const child of node.children) {
      sum += sumTreeValues(child);
    }
  }

  return sum;
};

// Tail recursion example
const factorial = (n: number, acc = 1): number => {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
};

// Trampoline for stack-safe recursion
const trampoline = <T>(
  fn: (...args: any[]) => T | (() => T | (() => T))
): ((...args: any[]) => T) => {
  return (...args) => {
    let result = fn(...args);
    while (typeof result === "function") {
      result = result();
    }
    return result;
  };
};
```

## Pattern Matching

- Use object literals or Maps for simple pattern matching
- Consider libraries that provide pattern matching capabilities
- Apply destructuring for simple pattern matching
- Use switch statements with discriminated unions

**Example:**

```typescript
// Object literal for pattern matching
const actionHandlers = {
  ADD_ITEM: (state, action) => [...state, action.payload],
  REMOVE_ITEM: (state, action) =>
    state.filter((item) => item.id !== action.payload),
  UPDATE_ITEM: (state, action) =>
    state.map((item) =>
      item.id === action.payload.id ? { ...item, ...action.payload.data } : item
    ),
};

const reducer = (state = [], action) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
};

// Destructuring for pattern matching
const getDisplayName = (person) => {
  const { firstName, lastName, title } = person;
  return title
    ? `${title} ${firstName} ${lastName}`
    : `${firstName} ${lastName}`;
};

// Switch with discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

const calculateArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
};
```

## Performance Considerations

- Be mindful of performance implications of pure functional code
- Apply memoization for expensive pure functions
- Consider lazy evaluation for performance optimization
- Use appropriate data structures for efficient operations

**Example:**

```typescript
// Memoization for expensive calculations
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

const expensiveCalculation = memoize((n: number): number => {
  console.log(`Computing for ${n}...`);
  // Simulate expensive calculation
  return n ** 2;
});

// Lazy evaluation with generators
function* lazyFilter<T>(
  arr: T[],
  predicate: (item: T) => boolean
): Generator<T> {
  for (const item of arr) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* lazyMap<T, U>(arr: T[], mapper: (item: T) => U): Generator<U> {
  for (const item of arr) {
    yield mapper(item);
  }
}

// Using efficient data structures
import { Set, Map } from "immutable";

const uniqueItems = Set(items);
const lookupTable = Map(items.map((item) => [item.id, item]));
```
