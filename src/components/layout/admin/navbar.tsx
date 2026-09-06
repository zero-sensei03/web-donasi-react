import { useMemo } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import {
  ChevronDown,
  HeartHandshake,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addToast } from '@heroui/react';

import { useAuthStore } from '@/stores/auth';
import { ADMIN_MENU, type AdminRole } from '@/constants/MenuConstant';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const role = user?.role as AdminRole | undefined;

  const menus = useMemo(() => {
    if (!role) {
      return [];
    }

    return ADMIN_MENU.filter((item) => item.roles.includes(role));
  }, [role]);

  const handleLogout = () => {
    logout();

    addToast({
      title: 'Berhasil keluar',
      description: 'Sesi kamu telah diakhiri.',
      color: 'success',
    });

    navigate('/login', {
      replace: true,
    });
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }

    return location.pathname.startsWith(href);
  };

  return (
    <Navbar
      maxWidth="full"
      height="72px"
      className="border-b border-slate-200 bg-white"
      classNames={{
        wrapper: 'max-w-7xl px-4 sm:px-6 lg:px-8',
      }}
    >
      {/* Brand */}
      <NavbarBrand className="shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-atac-green-soft border border-atac-green-light flex items-center justify-center">
            <HeartHandshake size={21} className="text-atac-green-dark" />
          </div>

          <div className="hidden sm:block">
            <p className="font-bold text-foreground leading-none">
              Ayo Berdonasi
            </p>

            <p className="text-[11px] text-slate-400 mt-1">Administration</p>
          </div>
        </Link>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent justify="center" className="hidden lg:flex gap-1">
        {menus.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <NavbarItem key={item.href}>
              <Link
                to={item.href}
                className={`
                  flex items-center gap-2
                  px-3 py-2
                  rounded-lg
                  text-sm font-medium
                  transition-colors
                  ${
                    active
                      ? 'bg-atac-green-soft text-atac-green-dark'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Mobile menu */}
        <NavbarItem className="lg:hidden">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="Buka menu">
                <Menu size={21} />
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Menu administrasi"
              className="min-w-[220px]"
            >
              {menus.map((item) => {
                const Icon = item.icon;

                return (
                  <DropdownItem
                    key={item.href}
                    startContent={<Icon size={17} />}
                    onPress={() => navigate(item.href)}
                    className={
                      isActive(item.href)
                        ? 'text-atac-green-dark bg-atac-green-soft'
                        : ''
                    }
                  >
                    {item.label}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* User */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Avatar
                  size="sm"
                  name={user?.email?.charAt(0).toUpperCase()}
                  className="bg-atac-green-light text-atac-green-dark"
                />

                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">
                    {user?.email}
                  </p>

                  <p className="text-[11px] text-slate-500">{user?.role}</p>
                </div>

                <ChevronDown
                  size={15}
                  className="hidden sm:block text-slate-400"
                />
              </button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Account menu">
              <DropdownItem
                key="role"
                isReadOnly
                startContent={<ShieldCheck size={17} />}
                className="cursor-default"
              >
                Role: {user?.role}
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut size={17} />}
                onPress={handleLogout}
              >
                Keluar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
