// components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'auto' for instant scroll, 'smooth' for smooth scrolling
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
