# Save Critique Edge Function

This Supabase edge function creates a new critique record in the `critiques` table when a user completes a payment for a video critique.

## Function Details

- **Endpoint**: `/functions/v1/save-critique`
- **Method**: POST
- **Authentication**: Required (Bearer token)

## Request Body

```json
{
  "userId": "uuid",
  "adjudicatorId": "uuid",
  "videoId": "number",
  "price": "number"
}
```

## Response

### Success Response

```json
{
  "success": true,
  "critiqueId": "uuid",
  "message": "Critique created successfully"
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## Database Schema

The function inserts records into the `critiques` table with the following structure:

```sql
create table public.critiques (
  created_at timestamp with time zone not null default now(),
  user_id uuid null default gen_random_uuid(),
  adjudicator_id uuid null default gen_random_uuid(),
  video_id bigint null,
  status numeric null,
  price numeric null,
  completion_date text null,
  id uuid not null default gen_random_uuid(),
  review_id uuid null default gen_random_uuid(),
  constraint critiques_pkey primary key (id),
  constraint critiques_adjudicator_id_fkey foreign KEY (adjudicator_id) references adj_profiles (id),
  constraint critiques_review_id_fkey foreign KEY (review_id) references reviews (id),
  constraint critiques_user_id_fkey foreign KEY (user_id) references users (id),
  constraint critiques_video_id_fkey foreign KEY (video_id) references videos (id)
);
```

## Status Values

- `1`: Pending/Payment completed, ready for review
- `2`: In progress (adjudicator working on it)
- `3`: Completed
- `4`: Cancelled

## Deployment

To deploy this function:

```bash
supabase functions deploy save-critique
```

## Usage in Frontend

```typescript
import { saveCritique } from "../lib/api";

const result = await saveCritique(userId, adjudicatorId, videoId, price);

if (result.success) {
  console.log("Critique saved with ID:", result.critiqueId);
} else {
  console.error("Error saving critique:", result.error);
}
```
