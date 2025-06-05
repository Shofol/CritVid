# Authentication Setup Guide

This application uses Supabase for authentication with two methods:
1. **Google OAuth Sign-in**
2. **Email & Password Authentication**

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. A Google Cloud Console project (for OAuth)

## Supabase Configuration

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your:
   - **Project URL**
   - **Anon (public) key**

### 3. Environment Variables

1. Copy `supabase.env.example` to `.env.local`:
   ```bash
   cp supabase.env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Google OAuth Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - For local development: `http://localhost:5173/auth/callback`

### 2. Supabase OAuth Configuration

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and toggle it on
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Save the configuration

## Email Authentication Setup

Email/password authentication works out of the box with Supabase. You can configure:

1. **Email confirmation**: Go to **Authentication** > **Settings**
2. **Password requirements**: Set minimum length, complexity rules
3. **Email templates**: Customize confirmation and reset emails

## Authentication Flow

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Upon approval, redirected back to `/dashboard`
4. Session is automatically managed by Supabase

### Email/Password Flow
1. **Sign Up**: User enters email/password, receives confirmation email
2. **Sign In**: User enters credentials, authenticated immediately
3. **Password Reset**: Available through forgot password flow

## Components Overview

### Core Files
- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useAuth.ts` - Authentication state management hook
- `src/components/auth/AuthCard.tsx` - Main authentication UI
- `src/components/auth/SocialLoginButton.tsx` - Google OAuth button
- `src/components/auth/EmailSignInForm.tsx` - Email/password form

### Usage Example

```tsx
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Security Features

- **Automatic token refresh**
- **Session persistence** across browser sessions
- **Secure redirect handling**
- **Environment variable protection**

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Test both authentication methods:
   - Google OAuth sign-in
   - Email/password registration and login

## Troubleshooting

### Common Issues

1. **Google OAuth not working**:
   - Check redirect URIs in Google Cloud Console
   - Verify client ID/secret in Supabase settings
   - Ensure Google+ API is enabled

2. **Email confirmation not working**:
   - Check Supabase email settings
   - Verify SMTP configuration
   - Check spam folder

3. **Environment variables not loading**:
   - Ensure `.env.local` file exists
   - Restart development server after adding variables
   - Variables must start with `VITE_` for Vite apps

For more help, check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth). 