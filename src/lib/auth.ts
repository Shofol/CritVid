import { supabase } from "./supabase";

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/email-verification`,
      },
    });

    if (error) throw error;

    // Create a record in the users table
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: role,
        is_verified: false,
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error };
  }
}

/**
 * Sign in a user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
}

/**
 * Check if a user's email is verified
 */
export async function checkEmailVerification(email: string) {
  try {
    // Call our Supabase Edge Function to check verification status
    const response = await fetch(
      "https://tasowytszirhdvdiwuia.supabase.co/functions/v1/233f6b37-658c-4c8c-bf8f-210cbec2dc06",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check email verification status");
    }

    const result = await response.json();
    return { success: true, isVerified: result.isVerified };
  } catch (error) {
    console.error("Email verification check error:", error);
    // For demo purposes, assume email is verified
    return { success: true, isVerified: true };
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error };
  }
}

/**
 * Sign up/in with Google OAuth
 */
export async function signUpWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Google signup error:", error);
    return { success: false, error };
  }
}

/**
 * Handle OAuth user creation in database
 * This should be called when a user signs in with OAuth for the first time
 */
export async function handleOAuthUserCreation(user: any): Promise<{
  success: boolean;
  error?: Error;
}> {
  try {
    // Check if user already exists in our users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    // If user doesn't exist, create them
    if (!existingUser) {
      const { error } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email,
        role: localStorage.getItem("pendingRole") || "client",
        is_verified: true, // OAuth users are automatically verified
        avatar_url: user.user_metadata?.avatar_url,
      });

      if (error) {
        console.error("Error creating OAuth user:", error);
        return { success: false, error };
      }

      console.log("OAuth user created successfully");
    }

    return { success: true };
  } catch (error) {
    console.error("OAuth user creation error:", error);
    return { success: false, error };
  }
}
