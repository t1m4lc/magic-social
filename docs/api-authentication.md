# Authentication API Endpoint

This document describes how to use the `/api/auth` endpoint for authenticating users via Supabase in your Chrome extension or any client.

## Endpoint

`POST /api/auth`

## Request Body

Send a JSON object with the following fields:

```
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

- `email` (string, required): The user's email address.
- `password` (string, required): The user's password (minimum 6 characters).

## Response

- **200 OK**: Returns the authenticated user and session info.
  ```json
  {
    "user": { ... },
    "session": { ... }
  }
  ```
- **400 Bad Request**: Invalid input (see `data` for details).
- **401 Unauthorized**: Invalid credentials.

## Example (fetch)

```js
fetch('https://<your-domain>/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'yourPassword123' })
})
  .then(res => res.json())
  .then(console.log)
```

## Notes
- This endpoint uses Supabase's `signInWithPassword` method.
- On success, you receive the user object and session (including access token).
- Handle and store the session token securely in your extension.
- For more advanced flows (refresh, sign-up, etc.), see Supabase docs.

---

**Security:**
- Always use HTTPS in production.
- Never log or expose passwords.
- Rate limit and monitor this endpoint for abuse.

**References:**
- [Supabase Nuxt Auth Docs](https://supabase.nuxtjs.org/getting-started/introduction)
