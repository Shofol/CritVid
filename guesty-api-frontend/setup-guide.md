# Guesty Properties Page Setup Guide for Wix

## Overview

This guide will help you set up a beautiful properties page in Wix that displays listings from your Guesty account.

## Files Created

1. `guestyAuth.js` - Backend API functions for Guesty integration
2. `properties-page.js` - Frontend JavaScript for the properties page
3. `properties-page.html` - HTML structure for the page
4. `styles.css` - Modern, responsive CSS styling

## Setup Steps

### 1. Backend Setup (Wix Backend)

1. **Create a new backend file** in your Wix project:

   - Go to your Wix dashboard
   - Navigate to "Developer Tools" > "Backend"
   - Create a new file called `guestyAuth.js`
   - Copy the content from `guesty-api-backend/guestyAuth.js`

2. **Set up secrets** (Recommended for security):
   - In your Wix dashboard, go to "Settings" > "Secrets"
   - Add two new secrets:
     - `GUESTY_CLIENT_ID`: Your Guesty client ID
     - `GUESTY_CLIENT_SECRET`: Your Guesty client secret
   - Uncomment the `getSecret()` lines in the code

### 2. Frontend Setup (Wix Frontend)

1. **Create a new page** in your Wix site:

   - Go to "Pages" in your Wix dashboard
   - Click "Add Page" > "Blank Page"
   - Name it "Properties" or "Our Rentals"

2. **Add page elements**:

   - Add a **Container** element (ID: `propertiesContainer`)
   - Add a **Text** element for the header (ID: `pageHeader`)
   - Add an **Input** element for search (ID: `searchInput`)
   - Add a **Dropdown** element for filters (ID: `filterSelect`)
   - Add a **Button** element for refresh (ID: `refreshBtn`)
   - Add a **Container** for loading spinner (ID: `loadingSpinner`)
   - Add a **Text** element for error messages (ID: `errorMessage`)

3. **Add custom code**:
   - Go to "Settings" > "Custom Code"
   - Add the CSS from `styles.css`
   - Add the JavaScript from `properties-page.js`

### 3. Page Structure

Your Wix page should have this structure:

```
Page Container
├── Header Section
│   ├── Page Title
│   └── Subtitle
├── Search & Filter Section
│   ├── Search Input
│   ├── Filter Dropdown
│   └── Refresh Button
├── Loading Spinner (hidden by default)
├── Error Message (hidden by default)
└── Properties Container
    └── Property Cards (dynamically added)
```

### 4. Custom Code Implementation

#### CSS (Add to Custom Code > CSS)

```css
/* Copy the entire content from styles.css */
```

#### JavaScript (Add to Custom Code > JavaScript)

```javascript
// Copy the content from properties-page.js
// Make sure to import the backend function correctly
```

### 5. Backend Function Import

In your frontend JavaScript, make sure to import the backend function:

```javascript
import { getAllProperties } from "backend/guestyAuth.js";
```

### 6. Testing

1. **Test the connection**:

   - Open your properties page
   - Check the browser console for any errors
   - Verify that properties are loading

2. **Test the search and filter**:
   - Try searching for properties
   - Test the filter dropdown
   - Verify the refresh button works

## Customization Options

### Styling

- Modify the CSS variables in `styles.css` to match your brand colors
- Adjust the grid layout by changing the `grid-template-columns` property
- Customize the card design by modifying the `.property-card` styles

### Functionality

- Add more filter options in the dropdown
- Implement pagination for large property lists
- Add property details pages
- Implement booking functionality

### Data Display

- Modify the `createPropertyCard()` function to show different property information
- Add more property details like bedrooms, bathrooms, etc.
- Include property ratings or reviews

## Troubleshooting

### Common Issues

1. **"Failed to get token" error**:

   - Check your Guesty credentials
   - Verify the client ID and secret are correct
   - Ensure the OAuth2 request format is correct

2. **Properties not loading**:

   - Check the browser console for JavaScript errors
   - Verify the backend function is working
   - Check your Guesty API permissions

3. **Styling issues**:
   - Make sure the CSS is properly loaded
   - Check for conflicting styles from other Wix elements
   - Verify the element IDs match between HTML and JavaScript

### Debug Mode

Add this to your JavaScript for debugging:

```javascript
// Enable debug logging
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[Guesty Debug] ${message}`, data);
  }
}
```

## Security Notes

1. **Never expose credentials** in frontend code
2. **Use Wix Secrets** for storing API credentials
3. **Implement rate limiting** if needed
4. **Add error handling** for API failures

## Performance Optimization

1. **Implement caching** for API responses
2. **Add pagination** for large property lists
3. **Optimize images** by using appropriate sizes
4. **Minimize API calls** by batching requests

## Support

If you encounter issues:

1. Check the Wix documentation
2. Review the Guesty API documentation
3. Check browser console for errors
4. Verify all file paths and imports are correct
