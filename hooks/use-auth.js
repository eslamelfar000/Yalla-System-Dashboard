"use client";
import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  getAuthToken, 
  getUserData, 
  removeAuthToken, 
  removeUserData, 
  isAuthenticated as checkIsAuthenticated,
  getCurrentUserRole,
  canAccessRoute,
  getDefaultRouteForRole,
  validateToken,
  USER_ROLES,
  ROUTE_PERMISSIONS
} from '@/lib/auth-utils';

// Create auth context
const AuthContext = createContext({});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        const authToken = getAuthToken();
        const userData = getUserData();
        
        if (authToken && userData) {
          // Validate token (you can enhance this with API call)
          const isValid = await validateToken();
          
          if (isValid) {
            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear auth data
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Redirect to appropriate route based on role
    const defaultRoute = getDefaultRouteForRole(userData.role);
    router.push(defaultRoute);
  };

  const logout = async () => {
    removeAuthToken();
    removeUserData();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const checkRouteAccess = (route) => {
    if (!user) return false;
    return canAccessRoute(route, user.role);
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    checkRouteAccess,
    hasRole,
    hasAnyRole,
    USER_ROLES,
    ROUTE_PERMISSIONS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for role-based access control
export const useRoleAccess = () => {
  const { user, checkRouteAccess, hasRole, hasAnyRole } = useAuth();
  
  return {
    userRole: user?.role,
    checkRouteAccess,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole(USER_ROLES.ADMIN),
    isTeacher: hasRole(USER_ROLES.TEACHER),
    isQuality: hasRole(USER_ROLES.QUALITY)
  };
};

// Route protection hook
export const useRouteProtection = () => {
  const { isAuthenticated, loading, checkRouteAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Extract path without locale
      const pathSegments = pathname.split('/');
      const pathWithoutLocale = '/' + pathSegments.slice(2).join('/');
      
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
        return;
      }

      if (!checkRouteAccess(pathWithoutLocale)) {
        // Redirect to dashboard if no access
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, pathname, router, checkRouteAccess]);

  return { isAuthenticated, loading };
}; 