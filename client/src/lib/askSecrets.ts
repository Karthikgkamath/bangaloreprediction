// Helper functions to manage secrets for external APIs

/**
 * Checks if the Google Maps API key is available
 */
export const hasGoogleMapsApiKey = (): boolean => {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
};

/**
 * Gets the Google Maps API key from environment variables
 */
export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
};

/**
 * Asks the user to set up the Google Maps API key (to be called in components)
 */
export const askSecrets = () => {
  console.warn('Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
};