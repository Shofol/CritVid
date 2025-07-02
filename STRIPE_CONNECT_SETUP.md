# Stripe Connect Setup Guide

This guide explains how to set up Stripe Connect for adjudicators to receive payments for their critiques.

## Overview

The implementation includes:

- **Edge Function**: `supabase/functions/stripe-connect/` - Handles Stripe Connect account creation and onboarding
- **Frontend Service**: `src/lib/stripeConnectService.ts` - API client for Stripe Connect operations
- **UI Component**: `src/components/adjudicator/StripeConnectModal.tsx` - Modal for Stripe Connect setup
- **Integration**: Updated `src/pages/adjudicator/Payments.tsx` with Stripe Connect button

## Prerequisites

1. **Stripe Account**: You need a Stripe account with Connect enabled
2. **Supabase Project**: Your Supabase project should be set up
3. **Environment Variables**: Configure the necessary environment variables

## Environment Variables

Set these environment variables in your Supabase dashboard under **Settings > Edge Functions > Environment Variables**:

```bash
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

Make sure your `adjudicator_profiles` table includes these columns:

```sql
ALTER TABLE adjudicator_profiles
ADD COLUMN stripe_account_id TEXT,
ADD COLUMN stripe_account_status TEXT DEFAULT 'pending';
```

## Deployment

1. **Deploy the Edge Function**:

   ```bash
   ./scripts/deploy-stripe-connect-function.sh
   ```

2. **Set Environment Variables** in Supabase dashboard

3. **Test the Integration**:
   - Navigate to `/adjudicator/payments`
   - Click "Connect Stripe" button
   - Follow the onboarding flow

## How It Works

### 1. Account Creation

When an adjudicator clicks "Connect Stripe":

- The system creates a Stripe Connect Express account
- Account ID is stored in the database
- Status is set to "pending"

### 2. Onboarding Flow

- Adjudicator is redirected to Stripe's onboarding
- They complete required information (business details, bank account, etc.)
- Stripe verifies the information

### 3. Account Status

The system tracks:

- **Not Connected**: No Stripe account exists
- **Pending**: Account created but onboarding incomplete
- **Connected**: Account fully verified and ready for payments

## Features

### Frontend Features

- **Status Tracking**: Real-time status updates
- **Modal Interface**: Clean, user-friendly setup flow
- **Error Handling**: Comprehensive error messages
- **Loading States**: Visual feedback during operations

### Backend Features

- **Account Creation**: Express account setup
- **Onboarding Links**: Secure Stripe onboarding URLs
- **Status Checking**: Account verification status
- **Error Handling**: Robust error management

## API Endpoints

The edge function provides these endpoints:

### `create_account`

Creates a new Stripe Connect Express account

```json
{
  "method": "create_account",
  "email": "adjudicator@example.com",
  "country": "US",
  "business_type": "individual"
}
```

### `get_account`

Retrieves account details and status

```json
{
  "method": "get_account"
}
```

### `create_onboarding_link`

Creates onboarding URL for account completion

```json
{
  "method": "create_onboarding_link",
  "return_url": "https://your-app.com/adjudicator/payments"
}
```

## Security Considerations

1. **Authentication**: All requests require valid Supabase JWT tokens
2. **Authorization**: Users can only access their own Stripe accounts
3. **Environment Variables**: Sensitive keys are stored securely
4. **CORS**: Proper CORS headers for cross-origin requests

## Testing

### Test Mode

Use Stripe test keys for development:

- Test accounts can be created without real verification
- Test bank accounts: `4000000000000077` (success) or `4000000000000093` (declined)

### Production Mode

- Real verification required
- Real bank accounts needed
- Compliance with Stripe's requirements

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**:

   - Check if user is authenticated
   - Verify JWT token is valid

2. **"No Stripe account found"**:

   - Account may not have been created
   - Check database for `stripe_account_id`

3. **Onboarding Link Issues**:
   - Verify `return_url` is accessible
   - Check Stripe account status

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set
3. Check Supabase function logs
4. Verify Stripe dashboard for account status

## Next Steps

After Stripe Connect is set up, you can:

1. **Implement Payment Processing**: Use the connected accounts for payments
2. **Add Payout Management**: Handle automatic payouts to adjudicators
3. **Add Payment Analytics**: Track earnings and payment history
4. **Implement Webhooks**: Handle Stripe events for real-time updates

## Support

For issues with:

- **Stripe Connect**: Check [Stripe Connect Documentation](https://stripe.com/docs/connect)
- **Supabase Functions**: Check [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- **This Implementation**: Check the code comments and error messages
