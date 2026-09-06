import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { addToast } from '@heroui/react';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/auth';
import type { AdminRole } from '@/constants/MenuConstant';

type AdminGuardProps = {
  roles?: AdminRole[];
};

export default function AdminGuard({ roles }: AdminGuardProps) {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (user && roles && !roles.includes(user.role as AdminRole)) {
      addToast({
        title: 'Akses ditolak',
        description: 'Kamu tidak memiliki izin untuk mengakses halaman ini.',
        color: 'danger',
      });
    }
  }, [user, roles]);

  /**
   * Belum login
   */
  if (!token || !user) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /**
   * Tidak punya role yang dibutuhkan
   */
  if (roles && !roles.includes(user.role as AdminRole)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
