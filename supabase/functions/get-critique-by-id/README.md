# Get Critique By ID Edge Function

This Supabase edge function fetches a single critique by its ID with all related data from the database.

## Endpoint

`GET /functions/v1/get-critique-by-id/{critiqueId}`

## Path Parameters

- `critiqueId` (required): The UUID of the critique to fetch

## Response Format

### Success Response

```json
{
  "data": {
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
  },
  "debug": {
    "rawData": {
      /* raw database response */
    },
    "relationships": {
      "hasUser": true,
      "hasAdjudicator": true,
      "hasVideo": true,
      "hasReview": false
    }
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Critique ID

```json
{
  "error": "Critique ID is required"
}
```

#### 404 Not Found - Critique Not Found

```json
{
  "error": "Critique not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Failed to fetch critique",
  "details": "Error message details"
}
```

## Usage Examples

### Get a specific critique

```
GET /functions/v1/get-critique-by-id/a96d1900-0ed9-4ee9-aeb2-eda02410e49f
```

## Frontend Integration

```typescript
import { getAuthToken } from "./authUtils";

export const getCritiqueById = async (critiqueId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(
      `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/get-critique-by-id/${critiqueId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch critique");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching critique:", error);
    throw error;
  }
};
```

## Features

- **Complete data fetching** with all related tables joined
- **Error handling** for missing critiques and database errors
- **Debug information** to help troubleshoot relationship issues
- **Computed fields** for easier frontend usage
- **CORS support** for cross-origin requests
- **Authentication required** via Bearer token

## Related Functions

- `get-critiques` - Fetch multiple critiques with filtering
- `save-critique` - Create new critique records
