import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Sayfanın en üstüne git
  }, [pathname]); // Sayfa yolu değiştiğinde çalışır

  return null; // Bu bileşen herhangi bir HTML render etmez
};

export default ScrollToTop;
