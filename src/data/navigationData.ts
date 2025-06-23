import {
  BarChart3,
  Building,
  CheckCircle,
  Clock,
  Cloud,
  CreditCard,
  Database,
  Edit3,
  FileVideo,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Settings,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  Zap,
} from "lucide-react";

import {
  NavigationItem,
  NavItem,
  NavSection,
  UserRole,
} from "@/types/navigation";

// Client navigation items - Updated with separate My Videos and My Critiques
export const clientNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/client/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: '📁 My Videos',
  //   href: '/client/dashboard?tab=videos',
  //   icon: FolderOpen,
  // },
  // {
  //   title: '🎥 My Critiques',
  //   href: '/client/dashboard?tab=critiques',
  //   icon: Film,
  // },
  {
    title: "Upload Video",
    href: "/upload-video",
    icon: Upload,
  },
  {
    title: "Find Adjudicator",
    href: "/find-adjudicator",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/client/billing",
    icon: CreditCard,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Help & Contact",
    href: "/help",
    icon: HelpCircle,
  },
];

// Admin navigation items
export const adminNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Adjudicators",
    href: "/admin/adjudicators",
    icon: UserCheck,
  },
  {
    title: "Client Management",
    href: "/admin/clients",
    icon: Building,
  },
  {
    title: "Studio Owners",
    href: "/admin/studio-owners",
    icon: Building,
  },
  {
    title: "Video Reviews",
    href: "/admin/video-reviews",
    icon: FileVideo,
  },
  {
    title: "Email Templates",
    href: "/admin/email-templates",
    icon: Mail,
  },
  {
    title: "Test Email",
    href: "/admin/test-email",
    icon: Mail,
  },
  {
    title: "Statistics",
    href: "/admin/stats",
    icon: BarChart3,
  },
  {
    title: "Payment Reports",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Automation",
    href: "/admin/automation",
    icon: Zap,
  },
  {
    title: "Storage Management",
    href: "/admin/storage",
    icon: Cloud,
  },
  {
    title: "System Settings",
    href: "/admin/system",
    icon: Database,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Adjudicator navigation items
export const adjudicatorNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/adjudicator/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pending Critiques",
    href: "/adjudicator/pending-critiques",
    icon: Clock,
  },
  {
    title: "Completed Critiques",
    href: "/adjudicator/completed-critiques",
    icon: CheckCircle,
  },
  {
    title: "Payments",
    href: "/adjudicator/payments",
    icon: CreditCard,
  },
  {
    title: "Video Editor",
    href: "/video-editor",
    icon: Edit3,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Support",
    href: "/adjudicator/support",
    icon: Headphones,
  },
];

// Adjudicator navigation items for unapproved adjudicators

// Adjudicator navigation items
export const unApprovedAdjudicatorNavigationItems: NavigationItem[] = [
  {
    title: "Support",
    href: "/adjudicator/support",
    icon: Headphones,
  },
];

// Studio Critique navigation items
export const studioCritiqueNavigationItems: NavigationItem[] = [
  {
    title: "Upload Video",
    href: "/upload-video",
    icon: Upload,
  },
  {
    title: "Edit Video",
    href: "/video-editor",
    icon: Edit3,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
];

// Studio Owner navigation items
export const studioOwnerNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/studio/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Saved Critiques",
    href: "/studio/saved-critiques",
    icon: Video,
  },
  {
    title: "Team Management",
    href: "/studio/team",
    icon: Users,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

// Default user navigation items (fallback)
export const userNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/user-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Video Library",
    href: "/video-library",
    icon: Video,
  },
  {
    title: "Upload Video",
    href: "/upload-video",
    icon: Upload,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

// Helper function to convert NavigationItem[] to NavSection[]
export function getNavigationByRole(
  role: UserRole,
  isAdjudicatorApproved: boolean
): NavSection[] {
  let items: NavigationItem[] = [];

  switch (role) {
    case "admin":
      items = adminNavigationItems;
      break;
    case "adjudicator":
      items = isAdjudicatorApproved
        ? adjudicatorNavigationItems
        : unApprovedAdjudicatorNavigationItems;
      break;
    case "studio-owner":
      items = studioOwnerNavigationItems;
      break;
    case "studio_critique":
      items = studioCritiqueNavigationItems;
      break;
    case "client":
      items = clientNavigationItems;
      break;
    default:
      items = userNavigationItems;
  }

  // Convert NavigationItem[] to NavItem[]
  const navItems: NavItem[] = items.map((item) => {
    return {
      name: item.title,
      path: item.href,
      icon: "layout-dashboard", // Use a default icon for all items
      roles: [role],
    };
  });

  const result = [
    {
      title: role === "admin" ? "Admin" : "Navigation",
      items: navItems,
    },
  ];

  console.log("Navigation sections result:", result);
  return result;
}
