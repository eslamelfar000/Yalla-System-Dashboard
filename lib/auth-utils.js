// Authentication utility functions
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

// Base API URL - adjust this to match your API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://indigo-ferret-819035.hostingersite.com/api/v1/';

// Cookie and localStorage keys
const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Role-based access control definitions - Only 3 roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  QUALITY: 'quality'
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [USER_ROLES.QUALITY]: 1,
  [USER_ROLES.TEACHER]: 2,
  [USER_ROLES.ADMIN]: 3
};


// Token management
export const setAuthToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// User data management
export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  // Also store role in cookies for middleware access
  if (userData.role) {
    Cookies.set('user_role', userData.role, { expires: 7, secure: true, sameSite: 'strict' });
  }
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const removeUserData = () => {
  localStorage.removeItem(USER_DATA_KEY);
  // Also remove role cookie
  Cookies.remove('user_role');
};

// Get user role from cookies (for middleware)
export const getUserRoleFromCookies = () => {
  return Cookies.get('user_role');
};

// Role-based access control functions
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const hasAnyRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) return false;
  return requiredRoles.includes(userRole);
};

export const canAccessRoute = (route, userRole) => {
  const routePermissions = ROUTE_PERMISSIONS[route];
  
  // If route permissions not defined, deny access
  if (!routePermissions) return false;
  
  // If route is accessible by all authenticated users
  if (routePermissions === 'all') return true;
  
  // Check if user has required role
  return hasAnyRole(userRole, routePermissions);
};

export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return '/dashboard';
    case USER_ROLES.TEACHER:
      return '/dashboard';
    case USER_ROLES.QUALITY:
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

// API call helper
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Authentication functions
export const login = async (email, password) => {
  try {
    const response = await apiCall('dashboard/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.status && response.token) {
      setAuthToken(response.token);
      setUserData(response.data);
      return { success: true, data: response };
    } else {
      throw new Error(response.msg || 'Login failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await apiCall('dashboard/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local data regardless of API call success
    removeAuthToken();
    removeUserData();
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiCall('dashboard/profile/update', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });

    if (response.status) {
      // Update user data in localStorage
      setUserData(response.data);
      return { success: true, data: response };
    } else {
      throw new Error(response.msg || 'Profile update failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await apiCall('dashboard/profile/update-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }),
    });

    if (response.status) {
      return { success: true, data: response };
    } else {
      throw new Error(response.msg || 'Password update failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}dashboard/profile/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'Image upload failed');
    }

    if (data.status) {
      // Update user data in localStorage
      setUserData(data.data);
      return { success: true, data: data };
    } else {
      throw new Error(data.msg || 'Image upload failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken() && !!getUserData();
};

// Get current user role
export const getCurrentUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

// Validate token (you can enhance this to call API for validation)
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // You can implement API call to validate token
    // For now, just check if token exists and user data is available
    const userData = getUserData();
    return !!userData;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}; 