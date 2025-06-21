import {
  getProperties,
  getPropertyAvailability,
  getPropertyById,
  searchProperties,
} from "./guesty-properties.js";

/**
 * HTTP function to get all properties
 * GET /api/properties
 */
export async function getPropertiesHandler(request) {
  try {
    // Enable CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers,
      };
    }

    if (request.method !== "GET") {
      return {
        status: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Parse query parameters
    const url = new URL(request.url);
    const query = {
      limit: parseInt(url.searchParams.get("limit")) || 20,
      skip: parseInt(url.searchParams.get("skip")) || 0,
      status: url.searchParams.get("status") || "active",
      propertyType: url.searchParams.get("propertyType"),
      location: url.searchParams.get("location"),
    };

    const result = await getProperties(query);

    return {
      status: result.success ? 200 : 500,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error in getPropertiesHandler:", error);
    return {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    };
  }
}

/**
 * HTTP function to get a specific property by ID
 * GET /api/properties/{id}
 */
export async function getPropertyByIdHandler(request) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers,
      };
    }

    if (request.method !== "GET") {
      return {
        status: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Extract property ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const propertyId = pathParts[pathParts.length - 1];

    if (!propertyId) {
      return {
        status: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Property ID is required",
        }),
      };
    }

    const result = await getPropertyById(propertyId);

    return {
      status: result.success ? 200 : 500,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error in getPropertyByIdHandler:", error);
    return {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    };
  }
}

/**
 * HTTP function to get property availability
 * GET /api/properties/{id}/availability
 */
export async function getPropertyAvailabilityHandler(request) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers,
      };
    }

    if (request.method !== "GET") {
      return {
        status: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const propertyId = pathParts[pathParts.length - 2]; // availability is the last part
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!propertyId || !startDate || !endDate) {
      return {
        status: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Property ID, startDate, and endDate are required",
        }),
      };
    }

    const result = await getPropertyAvailability(
      propertyId,
      startDate,
      endDate
    );

    return {
      status: result.success ? 200 : 500,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error in getPropertyAvailabilityHandler:", error);
    return {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    };
  }
}

/**
 * HTTP function to search properties
 * POST /api/properties/search
 */
export async function searchPropertiesHandler(request) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers,
      };
    }

    if (request.method !== "POST") {
      return {
        status: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    let filters = {};
    try {
      filters = JSON.parse(request.body);
    } catch (error) {
      return {
        status: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
        }),
      };
    }

    const result = await searchProperties(filters);

    return {
      status: result.success ? 200 : 500,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error in searchPropertiesHandler:", error);
    return {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    };
  }
}
