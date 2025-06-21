# Get Critiques Edge Function

This Supabase edge function fetches critiques with all related data from the database.

## Endpoint

`GET /functions/v1/get-critiques`

## Query Parameters

- `adjudicator_id` (optional): Filter critiques by adjudicator ID
- `user_id` (optional): Filter critiques by user ID
- `status` (optional): Filter critiques by status (pending, under_review, completed)

## Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": "uuid",
      "adjudicator_id": "uuid",
      "video_id": 123,
      "status": "pending",
      "price": 50.0,
      "completion_date": "2024-01-15",
      "review_id": "uuid",

      // Related data
      "user": {
        "id": "uuid",
        "email": "student@example.com",
        "full_name": "John Doe",
        "avatar_url": "https://...",
        "role": "client",
        "is_verified": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      "adjudicator": {
        "id": "uuid",
        "name": "Jane Smith",
        "email": "adjudicator@example.com",
        "experience": "Professional dancer",
        "exp_years": 10,
        "ppc": 50.0,
        "turnaround_days": 3,
        "headshot": "https://...",
        "location": "New York",
        "approved": true,
        "created_at": "2024-01-01T00:00:00Z",
        "user_id": "uuid"
      },
      "video": {
        "id": 123,
        "title": "Ballet Performance",
        "dance_style": 1,
        "feedback_requested": "Technical feedback on form",
        "user_id": "uuid",
        "video_path": "https://...",
        "file_name": "ballet_performance.mp4",
        "duration": 180,
        "size": 50000000,
        "created_at": "2024-01-01T00:00:00Z",
        "dance_style_details": {
          "id": 1,
          "name": "Ballet"
        },
        "dance_style_name": "Ballet"
      },
      "review": {
        "id": "uuid",
        "review": "Excellent technique...",
        "rating": 5,
        "created_at": "2024-01-01T00:00:00Z",
        "client_id": "uuid",
        "client": {
          "id": "uuid"
        }
      },

      // Computed fields for easier access
      "title": "Ballet Performance",
      "student": "John Doe",
      "requestedAt": "2024-01-01T00:00:00Z",
      "dueDate": "2024-01-15"
    }
  ],
  "count": 1
}
```

## Usage Examples

### Get all critiques

```
GET /functions/v1/get-critiques
```

### Get critiques for a specific adjudicator

```
GET /functions/v1/get-critiques?adjudicator_id=123e4567-e89b-12d3-a456-426614174000
```

### Get critiques for a specific user

```
GET /functions/v1/get-critiques?user_id=123e4567-e89b-12d3-a456-426614174000
```

### Get pending critiques

```
GET /functions/v1/get-critiques?status=pending
```

### Combine filters

```
GET /functions/v1/get-critiques?adjudicator_id=123e4567-e89b-12d3-a456-426614174000&status=pending
```

## Error Response

```json
{
  "error": "Failed to fetch critiques",
  "details": "Error message details"
}
```
