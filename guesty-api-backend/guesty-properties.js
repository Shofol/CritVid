import { fetch } from "wix-fetch";
import { getSecret } from "wix-secrets-backend";

// Guesty API configuration
const GUESTY_API_BASE_URL = "https://open-api.guesty.com/v1";

/**
 * Get Guesty API credentials from Wix Secrets
 */
async function getGuestyCredentials() {
  try {
    const clientId = await getSecret("GUESTY_CLIENT_ID");
    const clientSecret = await getSecret("GUESTY_CLIENT_SECRET");
    return { clientId, clientSecret };
  } catch (error) {
    console.error("Error getting Guesty credentials:", error);
    throw new Error("Guesty credentials not configured");
  }
}

/**
 * Get OAuth access token from Guesty
 */
async function getAccessToken() {
  try {
    const { clientId, clientSecret } = await getGuestyCredentials();

    const response = await fetch("https://open-api.guesty.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

/**
 * Make authenticated request to Guesty API
 */
async function makeGuestyRequest(endpoint, options = {}) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${GUESTY_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Guesty API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error making Guesty request:", error);
    throw error;
  }
}

/**
 * Get all listings/properties from Guesty
 */
export async function getProperties(query = {}) {
  try {
    const {
      limit = 20,
      skip = 0,
      status = "active",
      propertyType,
      location,
    } = query;

    let endpoint = `/listings?limit=${limit}&skip=${skip}&status=${status}`;

    if (propertyType) {
      endpoint += `&propertyType=${propertyType}`;
    }

    if (location) {
      endpoint += `&location=${encodeURIComponent(location)}`;
    }

    const data = await makeGuestyRequest(endpoint);
    return {
      success: true,
      data: data.results || [],
      total: data.total || 0,
      limit,
      skip,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get a specific property by ID
 */
export async function getPropertyById(propertyId) {
  try {
    const data = await makeGuestyRequest(`/listings/${propertyId}`);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get property availability calendar
 */
export async function getPropertyAvailability(propertyId, startDate, endDate) {
  try {
    const endpoint = `/listings/${propertyId}/calendar?startDate=${startDate}&endDate=${endDate}`;
    const data = await makeGuestyRequest(endpoint);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching property availability:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search properties with filters
 */
export async function searchProperties(filters = {}) {
  try {
    const {
      location,
      checkIn,
      checkOut,
      guests,
      propertyType,
      amenities,
      priceMin,
      priceMax,
      limit = 20,
      skip = 0,
    } = filters;

    let endpoint = `/listings/search?limit=${limit}&skip=${skip}`;

    if (location) endpoint += `&location=${encodeURIComponent(location)}`;
    if (checkIn) endpoint += `&checkIn=${checkIn}`;
    if (checkOut) endpoint += `&checkOut=${checkOut}`;
    if (guests) endpoint += `&guests=${guests}`;
    if (propertyType) endpoint += `&propertyType=${propertyType}`;
    if (amenities) endpoint += `&amenities=${amenities.join(",")}`;
    if (priceMin) endpoint += `&priceMin=${priceMin}`;
    if (priceMax) endpoint += `&priceMax=${priceMax}`;

    const data = await makeGuestyRequest(endpoint);
    return {
      success: true,
      data: data.results || [],
      total: data.total || 0,
      limit,
      skip,
    };
  } catch (error) {
    console.error("Error searching properties:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
