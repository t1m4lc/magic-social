---
applyTo: "**/*supabase*.*,**/database/**,**/db/**,**/*.sql, **/*.vue,**/*vue*.*"
---

# Supabase Development Guidelines

## General Principles

- Use the Supabase JavaScript client with TypeScript type definitions
- Implement proper error handling for all database operations
- Follow the Row Level Security (RLS) principles for data protection
- Use prepared statements and parameterized queries to prevent SQL injection

## Authentication

- Use Supabase Auth for authentication flows
- Implement proper session management
- Consider OAuth providers for social login
- Secure routes that require authentication
- Use server-side authentication verification for sensitive operations

## Database Operations

- Use typed queries with the Supabase client
- Structure database models with proper relations
- Apply database indexes for query optimization
- Follow PostgreSQL best practices for table design
- Use RLS policies to control data access

## Storage

- Organize storage buckets logically
- Implement proper access control for storage buckets
- Use the Supabase storage client for file operations
- Handle proper cleanup of unused files
- Apply size and type restrictions to upload operations

## Realtime

- Use Supabase Realtime for live data updates
- Handle subscription lifecycle properly
- Implement proper error handling for realtime connections
- Consider optimistic UI updates with realtime confirmations

## Edge Functions

- Use Supabase Edge Functions for serverless operations
- Properly handle environment variables in functions
- Implement proper error handling and logging
- Keep functions small and focused on specific tasks

## Security Best Practices

- Never expose service keys in client-side code
- Use JWT verification for all authenticated requests
- Implement proper input validation
- Set up appropriate RLS policies for each table
- Consider using database functions for complex operations

## MCP Integration

- Follow the Model Context Protocol specifications when connecting to Supabase
- Store PAT tokens securely when using the Supabase MCP server
- Configure the proper tools and permissions for the AI assistant
- Use structured queries and commands when working with the database

## Examples

### Authentication

```typescript
// Implementing authentication with Supabase in Nuxt
<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

// Form state
const email = ref('')
const password = ref('')
const errorMsg = ref('')

async function signIn() {
  errorMsg.value = ''

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    // Redirect after successful login - always use navigateTo instead of router.push
    await navigateTo('/dashboard')
  } catch (error) {
    errorMsg.value = error.message
  }
}

async function signOut() {
  const { error } = await client.auth.signOut()
  if (!error) {
    // Always use navigateTo instead of router.push
    await navigateTo('/login')
  }
}
</script>
```

### Database Operations

```typescript
// Typed queries with proper error handling
export const useTasks = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  // Use Nuxt's useDayjs composable for date handling
  const dayjs = useDayjs();

  const tasks = ref<Task[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Fetch tasks with proper typing
  async function fetchTasks() {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await client
        .from("tasks")
        .select("id, title, description, status, due_date")
        .eq("user_id", user.value?.id)
        .order("due_date", { ascending: true });

      if (err) throw err;

      // Process dates with dayjs
      tasks.value = (data || []).map((task) => ({
        ...task,
        formattedDueDate: task.due_date
          ? dayjs(task.due_date).format("MMM D, YYYY")
          : "",
        isOverdue: task.due_date
          ? dayjs(task.due_date).isBefore(dayjs())
          : false,
      }));
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching tasks:", err);
    } finally {
      loading.value = false;
    }
  }

  // Create a new task
  async function createTask(newTask: Omit<Task, "id" | "user_id">) {
    try {
      // Format dates with dayjs if needed
      const taskWithFormattedDate = {
        ...newTask,
        due_date: newTask.due_date
          ? dayjs(newTask.due_date).format("YYYY-MM-DD")
          : null,
      };

      const { data, error: err } = await client
        .from("tasks")
        .insert({
          ...taskWithFormattedDate,
          user_id: user.value?.id,
        })
        .select()
        .single();

      if (err) throw err;

      tasks.value.push(data);
      return { success: true, data };
    } catch (err) {
      console.error("Error creating task:", err);
      return { success: false, error: err.message };
    }
  }

  // Initialize by fetching tasks
  onMounted(() => {
    if (user.value) fetchTasks();
  });

  // Watch for user changes
  watch(user, (newUser) => {
    if (newUser) fetchTasks();
    else tasks.value = [];
  });

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
  };
};
```

### RLS Policies

```sql
-- Example of Row Level Security policies
-- Table definition
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 2. Allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 3. Allow only authenticated users to insert their profile
CREATE POLICY "Authenticated users can insert their profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### Realtime Subscriptions

```typescript
// Implementing realtime updates
const useRealtimeMessages = (channelId: string) => {
  const client = useSupabaseClient<Database>();
  const messages = ref<Message[]>([]);
  const subscription = ref<RealtimeSubscription | null>(null);

  // Set up realtime subscription
  function subscribe() {
    subscription.value = client
      .channel(`room:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            messages.value.push(payload.new as Message);
          } else if (payload.eventType === "UPDATE") {
            const index = messages.value.findIndex(
              (m) => m.id === payload.new.id
            );
            if (index !== -1) {
              messages.value[index] = payload.new as Message;
            }
          } else if (payload.eventType === "DELETE") {
            messages.value = messages.value.filter(
              (m) => m.id !== payload.old.id
            );
          }
        }
      )
      .subscribe();
  }

  // Clean up subscription
  function unsubscribe() {
    if (subscription.value) {
      client.removeChannel(subscription.value);
      subscription.value = null;
    }
  }

  // Initial data loading
  async function loadInitialMessages() {
    const { data } = await client
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      messages.value = data.reverse();
    }
  }

  // Setup and cleanup
  onMounted(() => {
    loadInitialMessages();
    subscribe();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    messages,
    loadInitialMessages,
  };
};
```
