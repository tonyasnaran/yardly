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

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define the callback function
    window.initMap = () => {
      // The map will be initialized in the YardMap component
      console.log('Google Maps API loaded');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  return null;
};

export default GoogleMapsScript; 