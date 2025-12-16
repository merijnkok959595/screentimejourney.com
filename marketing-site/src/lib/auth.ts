// Simple auth state management for marketing site
export const AUTH_CONFIG = {
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.screentimejourney.com',
};

// Check if user is authenticated (simple localStorage check)
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for authentication tokens or session
  const authToken = localStorage.getItem('auth_token') || 
                   sessionStorage.getItem('auth_token') || 
                   getCookie('auth_token');
  
  return Boolean(authToken);
};

// Simple cookie getter
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookie = parts.pop()?.split(';').shift();
    return cookie || null;
  }
  return null;
};

// Logout function
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all auth-related storage
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  
  // Clear auth cookies
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  
  // Force reload to clear any cached state
  window.location.reload();
};