import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ke paling atas secara instant/halus
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Ubah ke "smooth" jika ingin efek scroll mengalir
    });
  }, [pathname]);

  return null;
};
