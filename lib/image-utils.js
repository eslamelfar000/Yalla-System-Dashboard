// Utility function to fix malformed image URLs from the API
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's a Next.js imported image object, return the src
  if (imageUrl && typeof imageUrl === 'object' && imageUrl.src) {
    return imageUrl.src;
  }
  
  // If it's already a valid URL with proper structure, return as is
  if (imageUrl.startsWith('http') && (imageUrl.includes('/images/') || imageUrl.includes('/uploads/') || imageUrl.includes('/storage/'))) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /storage/, /uploads/, or /images/, make it absolute
  if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/images/')) {
    // Use the base URL from your API configuration
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://indigo-ferret-819035.hostingersite.com';
    return `${baseUrl}${imageUrl}`;
  }
  
  // If it's a malformed URL like "https://domain.com/name", try to fix it
  if (imageUrl.startsWith('http') && imageUrl.includes('hostingersite.com')) {
    // Extract the filename from the URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Try different common image paths
    const baseUrl = 'https://indigo-ferret-819035.hostingersite.com';
    const possiblePaths = [
      `/storage/app/public/images/${filename}`,
      `/storage/images/${filename}`,
      `/uploads/images/${filename}`,
      `/api/v1/images/${filename}`,
      `/images/${filename}`
    ];
    
    // For now, return null to use fallback avatar
    // You can uncomment one of the paths below if you know the correct structure
    // return `${baseUrl}${possiblePaths[0]}`; // Uncomment and adjust index as needed
    return null;
  }
  
  // If it's a local image path, return as is
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }
  
  // If it's a relative path without leading slash, add it
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    return `/${imageUrl}`;
  }
  
  return imageUrl;
};

// Function to validate if an image URL is accessible
export const validateImageUrl = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Function to get fallback avatar initials
export const getAvatarInitials = (name) => {
  if (!name) return "U";
  
  // Remove any special characters and split by spaces
  const cleanName = name.replace(/[^a-zA-Z\s]/g, '').trim();
  if (!cleanName) return "U";
  
  const words = cleanName.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  
  return cleanName.slice(0, 2).toUpperCase();
}; 