import wixLocation from "wix-location-frontend";

// Property card component
export function propertyCardReady($w, itemData) {
  // Set property image
  if (itemData.pictures && itemData.pictures.length > 0) {
    $w("#propertyImage").src = itemData.pictures[0];
  } else {
    $w("#propertyImage").src =
      "https://via.placeholder.com/300x200?text=No+Image";
  }

  // Set property title
  $w("#propertyTitle").text = itemData.title || "Property";

  // Set property price
  const price = itemData.basePrice || itemData.price || 0;
  $w("#propertyPrice").text = formatPrice(price);

  // Set property address
  $w("#propertyAddress").text = formatAddress(itemData);

  // Set property details (bedrooms, bathrooms, guests)
  const details = [];
  if (itemData.bedrooms) details.push(`${itemData.bedrooms} bed`);
  if (itemData.bathrooms) details.push(`${itemData.bathrooms} bath`);
  if (itemData.guests) details.push(`${itemData.guests} guests`);

  $w("#propertyDetails").text = details.join(" • ");

  // Set property type
  if (itemData.propertyType) {
    $w("#propertyType").text = itemData.propertyType;
  }

  // Set rating if available
  if (itemData.rating) {
    $w("#propertyRating").text = `${itemData.rating} ★`;
    $w("#propertyRating").show();
  } else {
    $w("#propertyRating").hide();
  }

  // Set up click handler for the entire card
  $w("#propertyCard").onClick(() => {
    openPropertyDetails(itemData._id);
  });

  // Set up favorite button
  $w("#favoriteButton").onClick((event) => {
    event.stopPropagation(); // Prevent card click
    toggleFavorite(itemData._id);
  });

  // Set favorite button state
  updateFavoriteButton(itemData._id);
}

function openPropertyDetails(propertyId) {
  wixLocation.to(`/property/${propertyId}`);
}

function toggleFavorite(propertyId) {
  // Get current favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("propertyFavorites") || "[]");

  const index = favorites.indexOf(propertyId);
  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
  } else {
    // Add to favorites
    favorites.push(propertyId);
  }

  // Save back to localStorage
  localStorage.setItem("propertyFavorites", JSON.stringify(favorites));

  // Update button state
  updateFavoriteButton(propertyId);
}

function updateFavoriteButton(propertyId) {
  const favorites = JSON.parse(
    localStorage.getItem("propertyFavorites") || "[]"
  );
  const isFavorite = favorites.includes(propertyId);

  // Update button appearance
  const $favoriteButton = $w("#favoriteButton");
  if (isFavorite) {
    $favoriteButton.src = "https://example.com/heart-filled.png"; // Replace with your heart filled icon
    $favoriteButton.alt = "Remove from favorites";
  } else {
    $favoriteButton.src = "https://example.com/heart-outline.png"; // Replace with your heart outline icon
    $favoriteButton.alt = "Add to favorites";
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
  const parts = [address.city, address.state, address.country].filter(Boolean);

  return parts.join(", ");
}

// Animation functions for better UX
export function propertyCardMouseEnter($w) {
  // Add hover effect
  $w("#propertyCard").style.transform = "translateY(-2px)";
  $w("#propertyCard").style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
}

export function propertyCardMouseLeave($w) {
  // Remove hover effect
  $w("#propertyCard").style.transform = "translateY(0)";
  $w("#propertyCard").style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
}
