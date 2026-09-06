import { Outlet } from 'react-router-dom';

import AdminNavbar from './navbar';
import { SEO } from '@/components/SEO';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Admin Panel"
        description="Halaman administrasi platform donasi untuk mengelola campaign, donasi, konten, media, metode pembayaran, dan informasi platform."
      />
      <AdminNavbar />

      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
