"use client";
import React from "react";
import { useAuth, useRoleAccess } from "@/hooks/use-auth";
import { USER_ROLES } from "@/lib/auth-utils";
import { getRoleBasedMenu } from "@/config/menus";
import {
  AdminOnly,
  TeacherOnly,
  QualityOnly,
  RoleGuard,
} from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Example component demonstrating role-based access control
 * Only 3 roles: admin, teacher, quality
 */
export default function RoleBasedExample() {
  const { user, logout } = useAuth();
  const { hasRole, hasAnyRole, canAccessRoute } = useRoleAccess();

  // Get current user's menu items
  const userMenuItems = getRoleBasedMenu(user?.role, "classic");

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Current User Info</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          Available Menu Items ({userMenuItems.length})
        </h3>
        <ul className="space-y-1">
          {userMenuItems.map((item, index) => (
            <li key={index} className="text-sm">
              • {item.title} {item.href && `(${item.href})`}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Role Access Tests</h3>
        <div className="space-y-2 text-sm">
          <p>Admin Role: {hasRole(USER_ROLES.ADMIN) ? "✅" : "❌"}</p>
          <p>Teacher Role: {hasRole(USER_ROLES.TEACHER) ? "✅" : "❌"}</p>
          <p>Quality Role: {hasRole(USER_ROLES.QUALITY) ? "✅" : "❌"}</p>
          <p>
            Any Role:{" "}
            {hasAnyRole([USER_ROLES.ADMIN, USER_ROLES.TEACHER]) ? "✅" : "❌"}
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Route Access</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>Dashboard: {canAccessRoute("/dashboard") ? "✅" : "❌"}</p>
          <p>Users: {canAccessRoute("/users") ? "✅" : "❌"}</p>
          <p>QA Reports: {canAccessRoute("/qa-reports") ? "✅" : "❌"}</p>
          <p>Lessons Board: {canAccessRoute("/lessons-board") ? "✅" : "❌"}</p>
          <p>Payrolls: {canAccessRoute("/payrolls") ? "✅" : "❌"}</p>
          <p>Target: {canAccessRoute("/target") ? "✅" : "❌"}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
