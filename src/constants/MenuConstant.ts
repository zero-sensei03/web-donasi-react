import {
  Bell,
  FileClock,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
} from 'lucide-react';

export type AdminRole = 'SUPERADMIN' | 'ADMIN' | 'EDITOR';

export type AdminMenuItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: AdminRole[];
};

export const NavbarLandingMenu = [
  {
    name: 'Beranda',
    key: 'home',
    url: '/',
    isButton: false,
  },
  {
    name: 'Tentang Kami',
    key: 'about-us',
    url: '/about-us',
    isButton: false,
  },
  {
    name: 'Proposal Kegiatan',
    key: 'proposal',
    url: '/proposal',
    isButton: false,
  },
  {
    name: 'Galeri',
    key: 'gallery',
    url: '/gallery',
    isButton: false,
  },
  {
    name: 'Donasi & Dukungan',
    key: 'donation-support',
    url: '/donation-support',
    isButton: true,
  },
];

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    label: 'Beranda',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['SUPERADMIN', 'ADMIN', 'EDITOR'],
  },
  {
    label: 'User',
    href: '/admin/users',
    icon: Users,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    label: 'Site Setting',
    href: '/admin/site-settings',
    icon: Settings,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    label: 'Notification',
    href: '/admin/notifications',
    icon: Bell,
    roles: ['SUPERADMIN', 'ADMIN', 'EDITOR'],
  },
  {
    label: 'Campaign',
    href: '/admin/campaigns',
    icon: Megaphone,
    roles: ['SUPERADMIN', 'ADMIN', 'EDITOR'],
  },
  {
    label: 'Audit Log',
    href: '/admin/audit-logs',
    icon: FileClock,
    roles: ['SUPERADMIN'],
  },
];
