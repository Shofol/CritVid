# Get Adjudicators Edge Function

This Supabase Edge Function fetches all approved adjudicator profiles with their complete joined data including dance styles, reviews, certificates, and user information.

## Function Details

- **Endpoint**: `/functions/v1/get-adjudicators`
- **Method**: GET
- **Authentication**: Required (Bearer token)

## Response Format

```typescript
{
  data: AdjudicatorProfile[],
  count: number
}
```

## AdjudicatorProfile Structure

```typescript
{
  id: string;
  name: string;
  email: string;
  experience: string;
  exp_years: number;
  ppc: number;
  turnaround_days: number;
  headshot: string;
  location: string;
  approved: boolean;
  created_at: string;
  user_id: string;
  rating: number; // Calculated average rating
  review_count: number; // Total number of reviews
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: string;
    is_verified: boolean;
  };
  dance_styles: [
    {
      id: number;
      name: string;
    }
  ];
  reviews: [
    {
      id: number;
      review: string;
      rating: number;
      created_at: string;
      client: {
        id: string;
        full_name: string;
      };
    }
  ];
  certificates: [
    {
      id: number;
      title: string;
      issuer: string;
      issue_date: string;
    }
  ];
}
```

## Database Tables Used

- `adj_profiles` - Main adjudicator profile data
- `users` - User information (joined via user_id)
- `adj_dance_styles` - Adjudicator dance style associations
- `dance_styles` - Dance style definitions
- `adj_reviews` - Reviews for adjudicators
- `adjudicator_certificates` - Certificates held by adjudicators

## Features

1. **Only approved adjudicators**: Filters for `approved = true`
2. **Complete joined data**: Includes all related information in a single query
3. **Calculated fields**: Automatically calculates average rating and review count
4. **Sorted by creation date**: Most recent adjudicators first
5. **Error handling**: Proper error responses with CORS support

## Deployment

Deploy this function using the Supabase CLI:

```bash
supabase functions deploy get-adjudicators
```

## Usage Example

```typescript
const response = await fetch("/functions/v1/get-adjudicators", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  },
});

const result = await response.json();
console.log(result.data); // Array of adjudicator profiles
console.log(result.count); // Total count
```
