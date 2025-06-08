import { supabase } from "@/lib/supabase";

/**
 * Get the current session token for API calls
 * @returns The access token or null if not authenticated
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session token:", error);
      return null;
    }

    return session?.access_token || null;
  } catch (error) {
    console.error("Unexpected error getting session token:", error);
    return null;
  }
};

/**
 * Get authorization headers for API calls
 * @returns Headers object with Authorization if authenticated, empty object otherwise
 */
export const getAuthHeaders = async (): Promise<{ Authorization?: string }> => {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Make an authenticated API call
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Response from the API
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const authHeaders = await getAuthHeaders();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });
};
