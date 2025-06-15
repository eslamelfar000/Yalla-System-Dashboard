# Role-Based Authentication System (3 Roles)

This authentication system provides comprehensive role-based access control for the Yalla System Dashboard with **3 specific roles**: Admin, Teacher, and Quality. It includes automatic redirects, menu filtering, and route protection based on user roles.

## Features

- ✅ **Automatic Login Redirects**: Users with valid tokens are automatically redirected to their appropriate dashboards
- ✅ **3-Role System**: Simplified role management with Admin, Teacher, and Quality roles
- ✅ **Role-Based Routing**: Different user roles are redirected to different default routes
- ✅ **Menu Filtering**: Navigation menus are filtered based on user permissions
- ✅ **Route Protection**: Protected routes check user roles before allowing access
- ✅ **Middleware Integration**: Server-side route protection with automatic redirects
- ✅ **Client-Side Guards**: Components and hooks for role-based rendering

## User Roles (Only 3)

The system supports exactly 3 user roles with specific permissions:

```javascript
export const USER_ROLES = {
  ADMIN: "admin", // Full access to all features
  TEACHER: "teacher", // Access to teaching-related features
  QUALITY: "quality", // Access to QA reports and monitoring
};
```

## Default Routes by Role

When users log in, they are automatically redirected to their appropriate dashboard:

- **Admin**: `/dashboard` - Full analytics and management dashboard
- **Teacher**: `/lessons-board` - Teaching-focused interface
- **Quality**: `/qa-reports` - Quality assurance dashboard

## Available Routes (Sidebar Navigation Only)

### Common Routes (All Roles)

- `/dashboard` - Analytics dashboard
- `/user-website` - User website management
- `/calendar` - Calendar and scheduling
- `/board` - General board
- `/chat` - Communication
- `/reservation` - Reservation system
- `/requests` - Request management
- `/contact` - Contact management

### Admin-Only Routes

- `/users` - User management
- `/payrolls` - Payroll management
- `/target` - Target settings

### Quality-Specific Routes

- `/qa-reports` - Quality assurance reports

### Teacher-Specific Routes

- `/lessons-board` - Lessons management board

### Multi-Role Routes

- `/compelete-sessions` - Admin, Teacher, Quality
- `/students` - Admin, Teacher, Quality
- `/income` - Admin, Teacher, Quality
- `/archive` - Admin, Teacher, Quality

## Usage Examples

### 1. Basic Authentication Hook

```jsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Role-Based Access Control

```jsx
import { useRoleAccess } from "@/hooks/use-auth";

function DashboardComponent() {
  const { isAdmin, isTeacher, isQuality } = useRoleAccess();

  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminPanel />}
      {isTeacher && <TeacherTools />}
      {isQuality && <QualityReports />}
    </div>
  );
}
```

### 3. Role Guards for Conditional Rendering

```jsx
import {
  AdminOnly,
  TeacherOnly,
  QualityOnly,
  RoleGuard,
} from "@/components/auth/ProtectedRoute";

function NavigationMenu() {
  return (
    <nav>
      <a href="/dashboard">Dashboard</a>

      <AdminOnly>
        <a href="/users">User Management</a>
        <a href="/payrolls">Payrolls</a>
        <a href="/target">Target Settings</a>
      </AdminOnly>

      <TeacherOnly>
        <a href="/lessons-board">Lessons Board</a>
      </TeacherOnly>

      <QualityOnly>
        <a href="/qa-reports">QA Reports</a>
      </QualityOnly>

      <RoleGuard roles={["admin", "teacher", "quality"]}>
        <a href="/students">Students</a>
        <a href="/income">Income</a>
        <a href="/archive">Archive</a>
      </RoleGuard>
    </nav>
  );
}
```

### 4. Protected Route Component

```jsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AdminDashboard() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
```

## Route Permissions Configuration

```javascript
export const ROUTE_PERMISSIONS = {
  // Common routes (all authenticated users)
  "/dashboard": "all",
  "/user-website": "all",
  "/calendar": "all",
  "/board": "all",
  "/chat": "all",
  "/reservation": "all",
  "/requests": "all",
  "/contact": "all",

  // Admin-only routes
  "/users": ["admin"],
  "/payrolls": ["admin"],
  "/target": ["admin"],

  // Quality routes
  "/qa-reports": ["admin", "quality"],

  // Teacher routes
  "/lessons-board": ["admin", "teacher"],

  // Multi-role routes
  "/compelete-sessions": ["admin", "teacher", "quality"],
  "/students": ["admin", "teacher", "quality"],
  "/income": ["admin", "teacher", "quality"],
  "/archive": ["admin", "teacher", "quality"],
};
```

## Login Flow

1. User submits login form
2. API returns user data and token with one of 3 roles (admin/teacher/quality)
3. Token and user data are stored (localStorage + cookies)
4. User role is stored in cookie for middleware access
5. User is redirected to role-appropriate dashboard:
   - Admin → `/dashboard`
   - Teacher → `/lessons-board`
   - Quality → `/qa-reports`
6. Subsequent requests use stored authentication data

## Middleware Protection

The middleware automatically:

1. **Checks authentication**: Redirects to login if no token
2. **Validates roles**: Ensures users can access requested routes
3. **Handles redirects**: Automatically redirects based on user role
4. **Manages locales**: Maintains language preferences during redirects

## API Integration

The system expects your login API to return:

```json
{
  "status": true,
  "token": "jwt_token_here",
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin" // Must be one of: admin, teacher, quality
  }
}
```

## Testing Different Roles

To test different roles, modify the default login form values or create test accounts with different roles:

- **Admin Account**: Full access to all features
- **Teacher Account**: Access to teaching features (lessons, students, income)
- **Quality Account**: Access to QA features (reports, monitoring)

## Key Components

1. **`lib/auth-utils.js`** - Core authentication and role management
2. **`hooks/use-auth.js`** - React hooks for authentication state
3. **`components/auth/ProtectedRoute.jsx`** - Route protection components
4. **`middleware.js`** - Server-side route protection
5. **`config/menus.js`** - Role-based menu filtering

## Example Usage Component

You can test the role-based system using the example component:

```jsx
import RoleBasedExample from "@/components/examples/RoleBasedExample";

function TestPage() {
  return <RoleBasedExample />;
}
```

This system provides a clean, simple role-based access control specifically designed for your 3-role hierarchy and sidebar navigation routes.
