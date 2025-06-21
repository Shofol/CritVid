import wixLocation from "wix-location-frontend";
import wixWindow from "wix-window-frontend";

// Page elements
let $w;
let currentProperty = null;

// Initialize the page
export function pageReady() {
  $w = wixWindow.rendered;

  // Get property ID from URL
  const propertyId = getPropertyIdFromUrl();

  if (propertyId) {
    loadPropertyDetails(propertyId);
  } else {
    showError("Property ID not found in URL");
  }
}

function getPropertyIdFromUrl() {
  const url = wixLocation.url;
  const pathParts = url.split("/");
  return pathParts[pathParts.length - 1];
}

async function loadPropertyDetails(propertyId) {
  try {
    // Show loading state
    $w("#loadingIndicator").show();
    $w("#propertyContent").hide();

    // Make API call to get property details
    const response = await fetch(`/api/properties/${propertyId}`);
    const result = await response.json();

    if (result.success) {
      currentProperty = result.data;
      displayPropertyDetails();
    } else {
      showError("Failed to load property details: " + result.error);
    }
  } catch (error) {
    console.error("Error loading property details:", error);
    showError("Failed to load property details. Please try again.");
  } finally {
    $w("#loadingIndicator").hide();
    $w("#propertyContent").show();
  }
}

function displayPropertyDetails() {
  if (!currentProperty) return;

  // Basic property information
  $w("#propertyTitle").text = currentProperty.title || "Property Details";
  $w("#propertyPrice").text = formatPrice(
    currentProperty.basePrice || currentProperty.price
  );
  $w("#propertyAddress").text = formatAddress(currentProperty);
  $w("#propertyDescription").text =
    currentProperty.description || "No description available";

  // Property details
  if (currentProperty.bedrooms) {
    $w("#bedroomsCount").text = currentProperty.bedrooms.toString();
  }
  if (currentProperty.bathrooms) {
    $w("#bathroomsCount").text = currentProperty.bathrooms.toString();
  }
  if (currentProperty.guests) {
    $w("#guestsCount").text = currentProperty.guests.toString();
  }

  // Property type
  if (currentProperty.propertyType) {
    $w("#propertyType").text = currentProperty.propertyType;
  }

  // Amenities
  if (currentProperty.amenities && currentProperty.amenities.length > 0) {
    displayAmenities(currentProperty.amenities);
  }

  // Images
  if (currentProperty.pictures && currentProperty.pictures.length > 0) {
    displayImages(currentProperty.pictures);
  }

  // Host information
  if (currentProperty.host) {
    displayHostInfo(currentProperty.host);
  }

  // Load availability calendar
  loadAvailabilityCalendar();
}

function displayAmenities(amenities) {
  const amenitiesList = amenities
    .map((amenity) => `<li>${amenity}</li>`)
    .join("");

  $w("#amenitiesList").html = `<ul>${amenitiesList}</ul>`;
}

function displayImages(pictures) {
  // Set main image
  if (pictures.length > 0) {
    $w("#mainImage").src = pictures[0];
  }

  // Set up image gallery if there are multiple images
  if (pictures.length > 1) {
    $w("#imageGallery").data = pictures.slice(1);

    // Set up gallery item click handlers
    $w("#imageGallery").onItemReady(($item, itemData) => {
      $item("#galleryImage").onClick(() => {
        $w("#mainImage").src = itemData;
      });
    });
  }
}

function displayHostInfo(host) {
  if (host.name) {
    $w("#hostName").text = host.name;
  }
  if (host.avatar) {
    $w("#hostAvatar").src = host.avatar;
  }
  if (host.rating) {
    $w("#hostRating").text = `${host.rating} stars`;
  }
}

async function loadAvailabilityCalendar() {
  if (!currentProperty) return;

  try {
    // Get next 30 days availability
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      `/api/properties/${currentProperty._id}/availability?startDate=${startDate}&endDate=${endDate}`
    );
    const result = await response.json();

    if (result.success) {
      displayAvailabilityCalendar(result.data);
    }
  } catch (error) {
    console.error("Error loading availability:", error);
  }
}

function displayAvailabilityCalendar(availabilityData) {
  // This is a simplified calendar display
  // In a real implementation, you might want to use a proper calendar component

  if (availabilityData && availabilityData.length > 0) {
    const calendarHtml = availabilityData
      .map((day) => {
        const date = new Date(day.date);
        const isAvailable = day.available;
        const price = day.price ? formatPrice(day.price) : "";

        return `
                <div class="calendar-day ${
                  isAvailable ? "available" : "unavailable"
                }">
                    <div class="date">${date.getDate()}</div>
                    <div class="price">${price}</div>
                </div>
            `;
      })
      .join("");

    $w("#availabilityCalendar").html = calendarHtml;
  }
}

// Event handlers
export function backButtonClick() {
  wixLocation.to("/properties");
}

export function contactHostClick() {
  if (currentProperty && currentProperty.host) {
    // Open contact form or redirect to booking
    wixLocation.to(`/contact-host/${currentProperty._id}`);
  }
}

export function bookNowClick() {
  if (currentProperty) {
    // Redirect to booking page
    wixLocation.to(`/book/${currentProperty._id}`);
  }
}

// Helper functions
function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

function formatAddress(property) {
  const address = property.address || {};
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

function showError(message) {
  $w("#errorMessage").text = message;
  $w("#errorMessage").show();

  // Hide error after 5 seconds
  setTimeout(() => {
    $w("#errorMessage").hide();
  }, 5000);
}

// SEO optimization
export function onReady() {
  if (currentProperty) {
    // Set page title
    wixWindow.setTitle(`${currentProperty.title} - Property Details`);

    // Set meta description
    const description =
      currentProperty.description ||
      `Beautiful ${currentProperty.propertyType} in ${formatAddress(
        currentProperty
      )}`;
    wixWindow.setMetaDescription(description);
  }
}
