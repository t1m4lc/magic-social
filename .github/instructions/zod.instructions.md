---
applyTo: "**/*zod*.*,**/*schema*.*,**/*validation*.*"
---
# Zod Schema Validation Guidelines

## General Principles
- Use Zod for runtime type validation
- Define reusable schemas for common data structures
- Apply proper error handling for validation failures
- Leverage TypeScript inference with Zod schemas

## Schema Definition
- Create well-named schemas with meaningful field descriptions
- Use appropriate validators for each data type
- Apply custom error messages for better user experience
- Group related fields logically within schemas

## Validation Patterns
- Use `.parse()` for throwing validation
- Apply `.safeParse()` for non-throwing validation
- Handle validation errors gracefully
- Consider custom refinement for complex validation rules

## Error Handling
- Implement consistent error handling for validation failures
- Transform Zod errors into user-friendly messages
- Log validation errors for debugging
- Apply structured error responses for API endpoints

## Advanced Features
- Use transformations to normalize data
- Apply preprocess functions for input formatting
- Create custom validators with refinements
- Use union types for variant data structures

## Schema Composition
- Leverage schema composition for complex data structures
- Apply partial schemas for update operations
- Use schema extension for inheritance-like patterns
- Create utility functions for common schema patterns

## TypeScript Integration
- Extract TypeScript types from Zod schemas
- Use inferred types in function parameters and return values
- Apply consistent naming patterns for schemas and types
- Leverage Zod's type inference capabilities

## Best Practices
- Keep schemas close to their usage
- Document complex validation rules
- Test schemas with both valid and invalid inputs
- Consider performance implications for large objects

## Examples

### Basic Schema Definitions

```typescript
import { z } from 'zod';

// Simple user schema
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().min(18, 'Must be at least 18 years old'),
  role: z.enum(['admin', 'user', 'editor']),
  profileComplete: z.boolean().default(false),
  createdAt: z.date()
});

// Schema with optional fields
const updateUserSchema = userSchema.partial({
  name: true,
  age: true,
  role: true
}).omit({
  id: true,
  createdAt: true
});

// Create TypeScript types from schemas
type User = z.infer<typeof userSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### Complex Schemas with Relationships

```typescript
// Base schemas
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string()
});

const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['electronics', 'clothing', 'books', 'home', 'other']),
  inStock: z.boolean().default(true),
  createdAt: z.date()
});

// Order schema with relationships
const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  orderDate: z.date(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive()
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(['credit_card', 'paypal', 'apple_pay', 'google_pay'])
});

type Order = z.infer<typeof orderSchema>;
```

### Validation and Error Handling

```typescript
// Validation with proper error handling
function validateUserInput(data: unknown): User | null {
  try {
    // Will throw if validation fails
    const validatedUser = userSchema.parse(data);
    return validatedUser;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format and handle validation errors
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      console.error('Validation failed:', formattedErrors);
    } else {
      console.error('Unexpected error during validation:', error);
    }
    
    return null;
  }
}

// Safe parsing without throwing
function safeValidateUser(data: unknown) {
  const result = userSchema.safeParse(data);
  
  if (result.success) {
    // Type is automatically inferred
    return {
      success: true,
      data: result.data
    };
  } else {
    // Format error messages by path
    const errorsByPath = result.error.flatten().fieldErrors;
    
    return {
      success: false,
      errors: errorsByPath
    };
  }
}
```

### Custom Validation Rules

```typescript
// Custom validation with refinements
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      password => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      password => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      password => /[0-9]/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      password => /[^A-Za-z0-9]/.test(password),
      'Password must contain at least one special character'
    ),
  confirmPassword: z.string()
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

// Advanced validation with custom error messages
const registrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema.shape.password,
  confirmPassword: z.string(),
  birthDate: z.date()
    .refine(
      date => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18;
      },
      { message: 'You must be at least 18 years old to register' }
    ),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' })
  })
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);
```

### Integration with Forms

```typescript
// Vue.js form integration with VeeValidate
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const loginSchema = toTypedSchema(z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
}));

export default {
  setup() {
    const { handleSubmit, errors, values } = useForm({
      validationSchema: loginSchema
    });
    
    const onSubmit = handleSubmit(async (formValues) => {
      try {
        await login(formValues);
        // Handle successful login
      } catch (error) {
        // Handle login error
      }
    });
    
    return {
      onSubmit,
      errors,
      values
    };
  }
};
```

### API Request Validation

```typescript
// Server-side API validation (Nitro/Express)
import { z } from 'zod';

// Define the schema
const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['electronics', 'clothing', 'books', 'home', 'other']),
  inStock: z.boolean().default(true)
});

// API route handler
export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = createProductSchema.parse(body);
    
    // Process the validated data
    const product = await createProduct(validatedData);
    
    return {
      success: true,
      product
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        data: formattedErrors
      });
    }
    
    // Handle other errors
    console.error('Error creating product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  }
});
```
