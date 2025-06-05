export type UserRole = 'client' | 'admin' | 'adjudicator' | 'studio-owner' | 'studio_critique';

export interface NavItem {
  name: string;
  path: string;
  icon: string;
  roles: UserRole[];
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}