import { fetch } from "wix-fetch";

export async function getGuestyAccessToken() {
  // const clientId = await getSecret("GUESTY_CLIENT_ID");
  // const clientSecret = await getSecret("GUESTY_CLIENT_SECRET");
  // console.log(clientId);
  // console.log(clientSecret);

  // Create form-encoded body instead of JSON
  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("scope", "open-api");
  formData.append("client_id", "0oap8nj5jvJN53TDx5d7");
  formData.append(
    "client_secret",
    "5AWjbUWGqMLeEl-sbReQ4CRlRNFD7tWbGxaPC1O_uA_5jdq-4Om2OSO1OAbLZ37L"
  );

  const response = await fetch("https://open-api.guesty.com/oauth2/token", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Failed to get token: " + err);
  }

  const data = await response.json();
  return data.access_token; // You can also return data.expires_in if needed
}

export async function getAllProperties() {
  try {
    // Get the access token first
    const accessToken = await getGuestyAccessToken();

    // Build the URL with all query parameters from the curl request
    const baseUrl = "https://open-api.guesty.com/v1/listings";
    const queryParams = new URLSearchParams({
      viewId: "null",
      q: "null",
      city: "null",
      active: "true",
      pmsActive: "true",
      integrationId: "null",
      listed: "true",
      available: "",
      ignoreFlexibleBlocks: "false",
      tags: "null",
      fields: "null",
      sort: "title",
      limit: "25",
      skip: "0",
    });

    const url = `${baseUrl}?${queryParams.toString()}`;

    // Make request to get all properties with exact headers from curl
    const response = await fetch(url, {
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Failed to get properties: " + err);
    }

    const data = await response.json();
    return data.results || data; // Guesty API typically returns results in a 'results' field
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

// Optional: Function to get a specific property by ID
export async function getPropertyById(propertyId) {
  try {
    const accessToken = await getGuestyAccessToken();

    const response = await fetch(
      `https://open-api.guesty.com/api/v1/listings/${propertyId}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to get property ${propertyId}: ${err}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching property ${propertyId}:`, error);
    throw error;
  }
}
