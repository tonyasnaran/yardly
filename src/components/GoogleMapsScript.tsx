'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMapsScript = () => {
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google) return;

    // Create the script loader
    const loader = document.createElement('script');
    loader.src = 'https://maps.googleapis.com/maps/api/js/loader.js';
    loader.async = true;

    loader.onload = () => {
      // Once the loader is ready, load the main API
      (window as any).google.maps.importLibrary('places').then(() => {
        console.log('Google Maps Places library loaded');
      });
    };

    document.head.appendChild(loader);

    return () => {
      // Cleanup
      document.head.removeChild(loader);
    };
  }, []);

  return null;
};

export default GoogleMapsScript; 