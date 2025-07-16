import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let defaultLocale = "en";
let locales = ["bn", "en", "ar"];

// Route permissions by role - Only 3 roles and sidebar routes
const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  QUALITY: 'quality'
};

const ROUTE_PERMISSIONS = {
  // Common routes (accessible by all authenticated users)
  '/dashboard': 'all',
  '/calendar': 'all',

  
  // Admin-only routes
  '/users': 'admin',
  '/payrolls': 'admin',
  '/compelete-sessions': 'admin',
  '/reservation': 'admin',
  '/requests': 'admin',
  '/contact': 'admin',
  '/user-website': 'admin',
  '/students': 'admin',
  '/qa-reports': 'admin',



  // Quality routes
    '/board': 'quality',

  
  // Teacher routes
  '/lessons-board': 'teacher',
  '/target': ['teacher'],


  
  // Multi-role routes
    '/chat': ['teacher', 'admin'],
  '/income': ['admin', 'teacher', 'quality'],
  '/archive': ['admin', 'teacher', 'quality'],
  '/user-profile': ['admin', 'teacher', 'quality'],
  '/user-profile/settings': ['admin', 'teacher', 'quality']
};

// Auth routes that should redirect to dashboard if user is logged in
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot', '/'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot', '/auth/verify'];

// Get the preferred locale
function getLocale(request) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  let headers = { "accept-language": acceptedLanguage };
  let languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

// Check if user has permission to access route
function canAccessRoute(route, userRole) {
  const routePermissions = ROUTE_PERMISSIONS[route];
  
  // If route permissions not defined, deny access (redirect to dashboard)
  if (!routePermissions) return false;
  
  // If route is accessible by all authenticated users
  if (routePermissions === 'all') return true;
  
  // Check if user has required role
  return routePermissions.includes(userRole);
}

// Get default route for user role (always dashboard home)
function getDefaultRouteForRole(role) {
  return '/dashboard';
}

// Extract user data from cookies (simplified - in production you'd validate JWT)
function getUserFromCookies(request) {
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  if (!authToken) return null;
  
  return {
    token: authToken,
    role: userRole || 'admin' // Default role if none found
  };
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle locale redirects first
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Extract current locale and path
  const segments = pathname.split('/');
  const currentLocale = segments[1];
  const pathWithoutLocale = '/' + segments.slice(2).join('/');

  // Get user from cookies
  const user = getUserFromCookies(request);
  const isAuthenticated = !!user;

  // Handle root path - redirect based on authentication
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    if (isAuthenticated) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      return NextResponse.redirect(new URL(`/${currentLocale}${defaultRoute}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/${currentLocale}/auth/login`, request.url));
    }
  }

  // Handle auth routes - redirect to dashboard if already logged in
  if (AUTH_ROUTES.includes(pathWithoutLocale)) {
    if (isAuthenticated) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      return NextResponse.redirect(new URL(`/${currentLocale}${defaultRoute}`, request.url));
    }
    // Allow access to auth routes if not authenticated
    return NextResponse.next();
  }

  // Handle public routes
  if (PUBLIC_ROUTES.includes(pathWithoutLocale)) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL(`/${currentLocale}/auth/login`, request.url));
  }

  // Check role-based permissions for protected routes
  if (!canAccessRoute(pathWithoutLocale, user.role)) {
    // Redirect to dashboard home if no permission (not login)
    const defaultRoute = getDefaultRouteForRole(user.role);
    return NextResponse.redirect(new URL(`/${currentLocale}${defaultRoute}`, request.url));
  }

  // Allow access if all checks pass
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    "/((?!api|assets|docs|.*\\..*|_next).*)",
  ],
};
