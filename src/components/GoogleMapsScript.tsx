'use client';

import { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapsScript = () => {
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
      language: 'en',
    });

    loader.load()
      .then(() => {
        console.log('Google Maps API loaded successfully');
      })
      .catch((error) => {
        console.error('Error loading Google Maps API:', error);
      });

  }, []);

  return null;
};

export default GoogleMapsScript; 