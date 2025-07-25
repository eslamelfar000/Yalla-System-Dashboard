import {
  Files,
  Graph,
  Messages,
  Calendar,
  UserSign,
} from "@/components/svg";
import { Archive, ArchiveIcon, ArchiveRestore, Box, CalendarSearch, CheckCheckIcon, CheckSquare, CircleDollarSignIcon, CircuitBoard, Contact, Contact2Icon, DollarSignIcon, Edit, MailCheckIcon, PhoneCall, PhoneCallIcon, Plus, User, UserCheck, Users, WalletCards, WalletIcon } from "lucide-react";
import { MOTION_KEY } from "rc-tree/lib/NodeList";

// User roles for menu filtering - Only 3 roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  QUALITY: 'quality'
};

// Helper function to filter menu items based on user role
export const filterMenuByRole = (menuItems, userRole) => {
  if (!userRole) {
    return [];
  }

  return menuItems.filter(item => {
    // If no roles specified, item is accessible to all
    if (!item.roles) return true;
    
    // Check if user role has access
    const hasAccess = item.roles.includes(userRole) || item.roles.includes('all');
    
    if (!hasAccess) return false;

    // Recursively filter child items
    if (item.child) {
      item.child = filterMenuByRole(item.child, userRole);
    }
    
    if (item.nested) {
      item.nested = filterMenuByRole(item.nested, userRole);
    }

    return true;
  });
};

export const menusConfig = {
  sidebarNav: {
    classic: [
      {
        isHeader: true,
        title: "menu",
        roles: ['all'],
      },
      {
        title: "Home",
        href: "/dashboard",
        icon: Graph,
        roles: ['all'],
      },
      {
        isHeader: true,
        title: "Application",
        roles: ['all'],
      },
      {
        title: "user website",
        icon: Edit,
        href: "/user-website",
        roles: ['admin'],
      },
      {
        title: "calendar",
        icon: Calendar,
        href: "/calendar",
        roles: ['all'],
      },
      {
        title: "Board",
        icon: CircuitBoard,
        href: "/board",
        roles: ['quality'],
      },
      {
        title: "Users",
        icon: Users,
        href: "/users",
        roles: ['admin'],
      },
      {
        title: "QA Reports",
        icon: Files,
        href: "/qa-reports",
        roles: ['admin'],
      },
      {
        title: "Completed Sessions",
        icon: CheckSquare,
        href: "/compelete-sessions",
        roles: ['admin'],
      },
      {
        title: "chat",
        icon: Messages,
        href: "/chat",
        roles: ['teacher', 'admin'],
      },
      {
        title: "Reservation",
        icon: MailCheckIcon,
        href: "/reservation",
        roles: ['admin'],
      },
      {
        title: "Students",
        icon: UserSign,
        href: "/students",
        roles: ['admin'],
      },
      {
        title: "Requests",
        icon: Plus,
        href: "/requests",
        roles: ['admin'],
      },
      {
        title: "Payrolls",
        icon: CircleDollarSignIcon,
        href: "/payrolls",
        roles: ['admin'],
      },
      {
        title: "Contact",
        icon: PhoneCallIcon,
        href: "/contact",
        roles: ['admin'],
      },
      {
        title: "Contact Us Messages",
        icon: Contact2Icon,
        href: "/contact-us-messages",
        roles: ['admin'],
      },
      {
        title: "Lessons Board",
        icon: Box,
        href: "/lessons-board",
        roles: ['teacher'],
      },
      {
        title: "Income",
        icon: WalletIcon,
        href: "/income",
        roles: ['all'],
      },
      {
        title: "Target",
        icon: Calendar,
        href: "/target",
        roles: ['teacher'],
      },
      {
        title: "Archive",
        icon: ArchiveIcon,
        href: "/archive",
        roles: ['all'],
      },

    ],
  },
};

// Role-specific menu configurations
export const getRoleBasedMenu = (userRole, menuType = 'classic') => {
  const baseMenu = menusConfig.sidebarNav[menuType];
  return filterMenuByRole(baseMenu, userRole);
};
