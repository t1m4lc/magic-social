---
applyTo: "**/*store*.*,**/stores/**,**/*pinia*.*, **/*.vue,**/*vue*.*"
---

# Pinia State Management Guidelines

## General Principles

- Use the composition API style for store definition
- Define proper types for state, getters, and actions
- Keep stores modular and focused on specific domains
- Follow the single responsibility principle for stores

## Store Definition

- Use `defineStore` for creating stores
- Apply a consistent naming convention for store IDs
- Export `useXxxStore` functions for store consumption
- Define explicit return types for store setup functions

## State Management

- Define state as ref or reactive objects
- Use computed properties for derived state
- Keep state normalized to avoid duplication
- Consider using TypeScript interfaces for complex state

## Actions

- Implement all state mutations in actions
- Use async/await for asynchronous operations
- Apply proper error handling in actions
- Return meaningful values from actions when appropriate

## Getters

- Use computed properties for getters
- Keep getters pure and focused on derived state
- Apply proper typing for getter return values
- Consider memoization for expensive computations

## Store Composition

- Extract common logic into composables
- Use store composition for shared functionality
- Consider using `storeToRefs` for destructuring reactive state
- Combine multiple stores when needed for complex operations

## Persistence

- Use plugins like `pinia-plugin-persistedstate` for state persistence
- Apply selective persistence for sensitive data
- Consider encryption for sensitive persisted data
- Implement proper state hydration for SSR applications

## Hot Module Replacement

- Implement HMR support for development experience
- Use the provided HMR utilities from Pinia
- Follow the recommended pattern for HMR setup
- Be mindful of state preservation during HMR

## Testing

- Create mock stores for testing
- Test store actions and getters in isolation
- Consider using `createTestingPinia` for testing
- Apply proper state initialization for tests

## Examples

### Setup Store Pattern

```typescript
// stores/user.ts
import { defineStore } from "pinia";
import type { User } from "@/types";

export const useUserStore = defineStore("user", () => {
  // State
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => !!currentUser.value);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters (as computed)
  const fullName = computed(() => {
    if (!currentUser.value) return "";
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
  });

  const userInitials = computed(() => {
    if (!currentUser.value) return "";
    return `${currentUser.value.firstName.charAt(
      0
    )}${currentUser.value.lastName.charAt(0)}`;
  });

  // Actions
  async function fetchUser() {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get<User>("/api/user/profile");
      currentUser.value = response.data;
    } catch (err) {
      error.value = err.message || "Failed to fetch user profile";
      console.error("Error fetching user:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(updates: Partial<User>) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.patch<User>("/api/user/profile", updates);

      // Update only the changed fields
      currentUser.value = {
        ...currentUser.value!,
        ...response.data,
      };

      return { success: true };
    } catch (err) {
      error.value = err.message || "Failed to update profile";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    currentUser.value = null;
    // Additional logout logic...
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    isLoading,
    error,

    // Getters
    fullName,
    userInitials,

    // Actions
    fetchUser,
    updateProfile,
    logout,
  };
});
```

### Store Persistence

```typescript
// stores/index.ts
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();

// Configure persistence plugin
pinia.use(
  createPersistedState({
    storage: localStorage,
    key: (id) => `app-${id}`,
    // Paths to persist per store
    paths: {
      cart: ["items"],
      user: ["currentUser"],
      settings: ["theme", "language"],
    },
    // Serialize/deserialize actions
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
  })
);

export default pinia;
```

### Store Composition

```typescript
// stores/checkout.ts
import { defineStore } from "pinia";
import { useCartStore } from "./cart";
import { useUserStore } from "./user";

export const useCheckoutStore = defineStore("checkout", () => {
  // Get other stores
  const cartStore = useCartStore();
  const userStore = useUserStore();

  // Local state
  const checkoutStep = ref(1);
  const shippingAddress = ref<Address | null>(null);
  const paymentMethod = ref<PaymentMethod | null>(null);
  const isProcessing = ref(false);
  const orderError = ref<string | null>(null);

  // Fill shipping address with user data
  function prefillShippingAddress() {
    if (!userStore.currentUser?.address) return;

    shippingAddress.value = { ...userStore.currentUser.address };
  }

  // Proceed to next checkout step
  function nextStep() {
    checkoutStep.value++;
  }

  // Go back to previous step
  function prevStep() {
    if (checkoutStep.value > 1) {
      checkoutStep.value--;
    }
  }

  // Complete order
  async function placeOrder() {
    if (
      !cartStore.items.length ||
      !shippingAddress.value ||
      !paymentMethod.value
    ) {
      orderError.value = "Missing required checkout information";
      return { success: false };
    }

    isProcessing.value = true;
    orderError.value = null;

    try {
      const order = await api.post("/api/orders", {
        items: cartStore.items,
        totalAmount: cartStore.totalPrice,
        shippingAddress: shippingAddress.value,
        paymentMethodId: paymentMethod.value.id,
      });

      // Clear cart after successful order
      cartStore.clearCart();

      return { success: true, order };
    } catch (error) {
      orderError.value = error.message || "Failed to place order";
      return { success: false, error: orderError.value };
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    checkoutStep,
    shippingAddress,
    paymentMethod,
    isProcessing,
    orderError,
    prefillShippingAddress,
    nextStep,
    prevStep,
    placeOrder,
  };
});
```
