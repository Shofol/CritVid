import wixLocation from "wix-location-frontend";
import wixWindow from "wix-window-frontend";
import { getAllProperties } from "../guesty-api-backend/guestyAuth.js";

// Page elements
let $w;
let propertiesContainer;
let loadingSpinner;
let errorMessage;
let searchInput;
let filterSelect;

// State management
let currentPage = 1;
let propertiesPerPage = 12;
let currentFilters = {};
let allProperties = [];
let filteredProperties = [];

// Initialize the page
export function pageReady() {
  $w = wixWindow.rendered;

  // Get page elements
  propertiesContainer = $w("#propertiesContainer");
  loadingSpinner = $w("#loadingSpinner");
  errorMessage = $w("#errorMessage");
  searchInput = $w("#searchInput");
  filterSelect = $w("#filterSelect");

  // Set up event handlers
  setupEventHandlers();

  // Load properties on page load
  loadProperties();
}

function setupEventHandlers() {
  // Search button
  $w("#searchButton").onClick(() => {
    performSearch();
  });

  // Filter dropdowns
  $w("#propertyTypeFilter").onChange(() => {
    applyFilters();
  });

  $w("#priceRangeFilter").onChange(() => {
    applyFilters();
  });

  // Pagination
  $w("#prevPageButton").onClick(() => {
    if (currentPage > 1) {
      currentPage--;
      displayProperties();
    }
  });

  $w("#nextPageButton").onClick(() => {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayProperties();
    }
  });

  // Property card clicks
  $w("#propertiesRepeater").onItemReady(($item, itemData) => {
    $item("#propertyCard").onClick(() => {
      openPropertyDetails(itemData._id);
    });
  });

  searchInput.onChange(() => filterProperties());
  filterSelect.onChange(() => filterProperties());
}

async function loadProperties() {
  try {
    showLoading(true);
    hideError();

    const properties = await getAllProperties();

    if (properties && properties.length > 0) {
      allProperties = properties;
      filteredProperties = properties;
      displayProperties();
    } else {
      showError("No properties found");
    }
  } catch (error) {
    console.error("Error loading properties:", error);
    showError("Failed to load properties. Please try again.");
  } finally {
    showLoading(false);
  }
}

function displayProperties() {
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

  // Update repeater data
  $w("#propertiesRepeater").data = propertiesToShow;

  // Update pagination info
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  $w("#paginationInfo").text = `Page ${currentPage} of ${totalPages}`;

  // Update pagination buttons
  $w("#prevPageButton").disable = currentPage <= 1;
  $w("#nextPageButton").disable = currentPage >= totalPages;

  // Update property count
  $w("#propertyCount").text = `${filteredProperties.length} properties found`;
}

function performSearch() {
  const searchTerm = $w("#searchInput").value;

  if (searchTerm.trim()) {
    // Use search API for better results
    searchProperties({
      location: searchTerm,
      limit: 50,
    });
  } else {
    // Reset to show all properties
    currentFilters = {};
    loadProperties();
  }
}

async function searchProperties(filters) {
  try {
    $w("#loadingIndicator").show();
    $w("#propertiesRepeater").hide();

    const response = await fetch("/api/properties/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    const result = await response.json();

    if (result.success) {
      filteredProperties = result.data;
      currentPage = 1; // Reset to first page
      displayProperties();
    } else {
      showError("Search failed: " + result.error);
    }
  } catch (error) {
    console.error("Error searching properties:", error);
    showError("Search failed. Please try again.");
  } finally {
    $w("#loadingIndicator").hide();
    $w("#propertiesRepeater").show();
  }
}

function applyFilters() {
  const propertyType = $w("#propertyTypeFilter").value;
  const priceRange = $w("#priceRangeFilter").value;

  currentFilters = {
    ...currentFilters,
    propertyType: propertyType !== "all" ? propertyType : null,
    priceRange: priceRange !== "all" ? priceRange : null,
  };

  // Apply filters to existing properties
  filteredProperties = allProperties.filter((property) => {
    // Property type filter
    if (
      currentFilters.propertyType &&
      property.propertyType !== currentFilters.propertyType
    ) {
      return false;
    }

    // Price range filter
    if (currentFilters.priceRange) {
      const price = property.basePrice || property.price || 0;
      const [min, max] = parsePriceRange(currentFilters.priceRange);

      if (price < min || price > max) {
        return false;
      }
    }

    return true;
  });

  currentPage = 1; // Reset to first page
  displayProperties();
}

function parsePriceRange(priceRange) {
  switch (priceRange) {
    case "0-100":
      return [0, 100];
    case "100-200":
      return [100, 200];
    case "200-500":
      return [200, 500];
    case "500+":
      return [500, Infinity];
    default:
      return [0, Infinity];
  }
}

function openPropertyDetails(propertyId) {
  // Navigate to property details page
  wixLocation.to(`/property/${propertyId}`);
}

function showError(message) {
  $w("#errorMessage").text = message;
  $w("#errorMessage").show();
  $w("#propertiesRepeater").hide();

  // Hide error after 5 seconds
  setTimeout(() => {
    $w("#errorMessage").hide();
  }, 5000);
}

// Helper function to format price
export function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// Helper function to format property address
export function formatAddress(property) {
  const address = property.address || {};
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

// Helper function to get property image
export function getPropertyImage(property) {
  if (property.pictures && property.pictures.length > 0) {
    return property.pictures[0];
  }
  return "https://via.placeholder.com/400x300?text=No+Image";
}

// Show/hide loading spinner
function showLoading(show) {
  if (show) {
    loadingSpinner.show();
    propertiesContainer.hide();
  } else {
    loadingSpinner.hide();
    propertiesContainer.show();
  }
}

// Hide error message
function hideError() {
  errorMessage.hide();
}

// Filter properties based on search and filter criteria
function filterProperties() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  // This would need to be implemented based on your data structure
  // For now, we'll reload all properties
  loadProperties();
}

// Refresh properties
export function refreshProperties() {
  loadProperties();
}
