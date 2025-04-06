'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

// Sample coordinates for cities (you can adjust these)
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Malibu': { lat: 34.0259, lng: -118.7798 },
  'Santa Monica': { lat: 34.0195, lng: -118.4912 },
  'Pasadena': { lat: 34.1478, lng: -118.1445 },
  'Beverly Hills': { lat: 34.0736, lng: -118.4004 },
  'West Hollywood': { lat: 34.0900, lng: -118.3617 },
};

interface YardMapProps {
  yards: Array<{
    id: number;
    title: string;
    city: string;
    price: number;
    image: string;
  }>;
  onMarkerClick?: (yardId: number) => void;
}

export default function YardMap({ yards, onMarkerClick }: YardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.Marker }>({});

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize the map centered on Los Angeles area
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 34.0522, lng: -118.2437 },
      zoom: 11,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(newMap);

    return () => {
      // Cleanup markers when component unmounts
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (!map || !yards.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Create markers for each yard
    yards.forEach(yard => {
      const coordinates = CITY_COORDINATES[yard.city] || CITY_COORDINATES['Santa Monica'];
      
      // Add some random offset to prevent markers from overlapping
      const lat = coordinates.lat + (Math.random() - 0.5) * 0.02;
      const lng = coordinates.lng + (Math.random() - 0.5) * 0.02;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: yard.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3A7D44',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="width: 200px; padding: 8px;">
            <img src="${yard.image}" alt="${yard.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${yard.title}</div>
            <div style="color: #3A7D44; font-weight: bold;">$${yard.price}/hour</div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        if (activeInfoWindow) {
          activeInfoWindow.close();
        }
        infoWindow.open(map, marker);
        setActiveInfoWindow(infoWindow);
        if (onMarkerClick) {
          onMarkerClick(yard.id);
        }
      });

      marker.addListener('mouseover', () => {
        if (activeInfoWindow) {
          activeInfoWindow.close();
        }
        infoWindow.open(map, marker);
        setActiveInfoWindow(infoWindow);
      });

      markersRef.current[yard.id] = marker;
    });
  }, [map, yards, onMarkerClick]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '400px',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        mb: 4,
      }}
    />
  );
} 