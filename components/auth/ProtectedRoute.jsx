"use client";
import React from "react";
import { useAuth, useRoleAccess } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-default-600">Loading...</p>
    </div>
  </div>
);

// Unauthorized access component
const UnauthorizedAccess = ({ userRole, requiredRoles }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md px-4">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-default-900 mb-2">
        Access Denied
      </h1>
      <p className="text-default-600 mb-4">
        You don't have permission to access this page.
      </p>
      <p className="text-sm text-default-500">
        Your role: <span className="font-medium capitalize">{userRole}</span>
        {requiredRoles && (
          <>
            <br />
            Required roles:{" "}
            <span className="font-medium capitalize">
              {requiredRoles.join(", ")}
            </span>
          </>
        )}
      </p>
    </div>
  </div>
);

// Higher-order component for route protection
export const withAuth = (Component, options = {}) => {
  const { requiredRoles = [], redirectTo = "/dashboard" } = options;

  return function ProtectedComponent(props) {
    const { isAuthenticated, loading, user } = useAuth();
    const { hasAnyRole, userRole } = useRoleAccess();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push("/auth/login");
          return;
        }

        if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
          router.push(redirectTo);
          return;
        }
      }
    }, [isAuthenticated, loading, hasAnyRole, router]);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return (
        <UnauthorizedAccess userRole={userRole} requiredRoles={requiredRoles} />
      );
    }

    return <Component {...props} />;
  };
};

// Component-based route protection
export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  fallback = null,
  showUnauthorized = true,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasAnyRole, userRole } = useRoleAccess();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to access this page.</div>;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (!showUnauthorized) {
      return fallback || null;
    }
    return (
      <UnauthorizedAccess userRole={userRole} requiredRoles={requiredRoles} />
    );
  }

  return children;
};

// Role-based conditional rendering
export const RoleGuard = ({
  roles,
  children,
  fallback = null,
  operator = "OR", // 'OR' or 'AND'
}) => {
  const { hasAnyRole, hasRole } = useRoleAccess();

  if (!roles || roles.length === 0) {
    return children;
  }

  const hasAccess =
    operator === "AND"
      ? roles.every((role) => hasRole(role))
      : hasAnyRole(roles);

  return hasAccess ? children : fallback;
};

// Admin-only wrapper
export const AdminOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Teacher-only wrapper (includes admin access)
export const TeacherOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["teacher"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Quality-only wrapper (includes admin access)
export const QualityOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["quality"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export default ProtectedRoute;
