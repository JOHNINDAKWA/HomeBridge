// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "document.documentElement.scrollTo" is the modern way to scroll to top.
    // "window.scrollTo" can also be used, but document.documentElement is preferred.
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' 
    });
  }, [pathname]); // Re-run this effect whenever the pathname changes

  return null; // This component doesn't render anything visible
};

export default ScrollToTop;