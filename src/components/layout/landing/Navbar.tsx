import type { siteSettingProps } from '.';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavbarLandingMenu } from '@/constants/MenuConstant';
import { cn } from '@heroui/react';
import { useSiteStore } from '@/stores/data-site';

export const NavbarPublic = ({
  siteSetting,
}: {
  siteSetting: siteSettingProps;
}) => {
  const campaign = useSiteStore((state) => state.campaignData);
  const navMenu = campaign ? NavbarLandingMenu : ( NavbarLandingMenu.filter(item => item.key === "home") || [] )


  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Menangani efek scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menentukan warna teks default (sebelum scroll) berdasarkan halaman
  const isTopHome = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTopHome
          ? 'bg-transparent text-white py-5'
          : isHome
            ? 'bg-background backdrop-blur-md shadow-sm py-3'
            : 'bg-white backdrop-blur-md shadow-sm py-3'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="sm:text-xl text-base font-bold tracking-wide flex items-center gap-2"
        >
          <img
            src={siteSetting.logo}
            alt={siteSetting.name}
            className="sm:w-14 w-12"
          />
          <span>{siteSetting.name}</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          {navMenu.map((item) => {
            const isActive = location.pathname === item.url;

            if (item.isButton) {
              return (
                <Link
                  key={item.key}
                  to={item.url}
                  className="relative overflow-hidden group px-5 py-2 rounded-md bg-primary text-primary-foreground font-medium shadow-sm transition-all duration-300 before:absolute before:inset-0 before:-ms-1 before:bg-supporter before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out"
                >
                  <span className="relative z-10 transition-colors duration-300">
                    {item.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.url}
                className={cn(
                  'relative font-medium transition-colors hover:opacity-80 duration-300',
                  {
                    'text-white': isTopHome && !isActive,
                    'text-gray-600': !isTopHome && !isActive,
                    'text-atac-green-dark font-semibold': isActive,
                  }
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isTopHome
              ? 'text-white hover:bg-white/10'
              : 'text-gray-800 hover:bg-gray-100'
          }`}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu dengan Animasi Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-background border-b border-gray-100 shadow-xl overflow-hidden mt-4"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navMenu.map((item) => {
                const isActive = location.pathname === item.url;

                if (item.isButton) {
                  return (
                    <Link
                      key={item.key}
                      to={item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-2 text-center py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-supporter transition-colors"
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    to={item.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn('py-2 px-3 rounded-md transition-colors', {
                      'bg-atac-green-dark/10 text-atac-green-dark font-semibold':
                        isActive,
                      'text-gray-600 hover:bg-gray-50 hover:text-gray-900':
                        !isActive,
                    })}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
