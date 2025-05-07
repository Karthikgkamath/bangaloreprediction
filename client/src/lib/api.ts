// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' as const,
};

// Helper function to get full API URL
export const getApiUrl = (path: string) => {
  return `${apiConfig.baseURL}${path}`;
};

// Helper function to make API requests
export const apiRequest = async <T = any>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(options?.headers || {}),
    },
    credentials: apiConfig.credentials,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  return res.json();
}; 