'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMapsScript() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Define the initialization callback
    window.initMap = () => {
      // Notify components that Google Maps is ready
      const event = new CustomEvent('google-maps-ready');
      window.dispatchEvent(event);
      setScriptLoaded(true);
    };

    // Clean up
    return () => {
      window.initMap = () => {};
    };
  }, []);

  if (scriptLoaded) return null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not defined');
    return null;
  }

  return (
    <>
      {/* Load the core Maps JavaScript API with Places library */}
      <Script
        id="google-maps"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initMap`}
        strategy="beforeInteractive"
        async
      />
      
      {/* Add the required CSS for the Places Autocomplete */}
      <style jsx global>{`
        .pac-container {
          z-index: 1100;
          border-radius: 8px;
          margin-top: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          font-family: inherit;
        }
        .pac-item {
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
        }
        .pac-item:hover {
          background-color: #f5f5f5;
        }
        .pac-icon {
          display: none;
        }
        .pac-item-query {
          font-size: 14px;
          padding-right: 4px;
        }
        gmp-place-autocomplete {
          width: 100%;
          border: none !important;
          outline: none !important;
          font-family: inherit;
          font-size: inherit;
        }
        gmp-place-autocomplete input {
          width: 100% !important;
          padding: 8px 0 !important;
          border: none !important;
          outline: none !important;
          font-family: inherit !important;
          font-size: inherit !important;
          background: transparent !important;
        }
      `}</style>
    </>
  );
} 