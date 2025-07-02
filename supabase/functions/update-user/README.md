# Update User Edge Function

This edge function allows authenticated users to update their profile information in the `users` table.

## Endpoint

```
POST /functions/v1/update-user
```

## Authentication

This function requires authentication. Include the user's JWT token in the Authorization header:

```
Authorization: Bearer <user-jwt-token>
```

## Request Body

The request body should be a JSON object containing the fields you want to update:

```json
{
  "email": "newemail@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "role": "client",
  "is_verified": true
}
```

All fields are optional. At least one field must be provided.

### Field Descriptions

- `email` (string, optional): User's email address
- `full_name` (string, optional): User's full name
- `avatar_url` (string, optional): URL to user's avatar image
- `role` (string, optional): User's role (defaults to 'client')
- `is_verified` (boolean, optional): Whether the user is verified

## Response

### Success Response (200)

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "role": "client",
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "User updated successfully"
}
```

### Error Responses

#### Unauthorized (401)

```json
{
  "error": "Unauthorized"
}
```

#### Bad Request (400)

```json
{
  "error": "At least one field must be provided for update"
}
```

#### Other Errors (400)

```json
{
  "error": "Error message describing the issue"
}
```

## Usage Examples

### Update user's name and email

```javascript
const response = await fetch("/functions/v1/update-user", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${userToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
  }),
});

const result = await response.json();
```

### Update only the avatar URL

```javascript
const response = await fetch("/functions/v1/update-user", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${userToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    avatar_url: "https://example.com/new-avatar.jpg",
  }),
});

const result = await response.json();
```

## Notes

- If the user doesn't exist in the `users` table, a new record will be created
- The `updated_at` field is automatically set to the current timestamp
- Email uniqueness is enforced by the database constraint
- The function validates that at least one field is provided for update
