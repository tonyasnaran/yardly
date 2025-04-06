'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import MapSearchBar from './MapSearchBar';

// Sample coordinates for cities (you can adjust these)
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Malibu': { lat: 34.0259, lng: -118.7798 },
  'Santa Monica': { lat: 34.0195, lng: -118.4912 },
  'Pasadena': { lat: 34.1478, lng: -118.1445 },
  'Beverly Hills': { lat: 34.0736, lng: -118.4004 },
  'West Hollywood': { lat: 34.0900, lng: -118.3617 },
};

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface YardMapProps {
  yards: Array<{
    id: number;
    title: string;
    city: string;
    price: number;
    image: string;
    lat?: number;
    lng?: number;
  }>;
  onMarkerClick?: (yardId: number) => void;
  onBoundsChanged?: (bounds: MapBounds) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
}

export default function YardMap({ 
  yards, 
  onMarkerClick, 
  onBoundsChanged,
  onMapLoaded 
}: YardMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.Marker }>({});

  // Debounce the bounds changed callback
  const debouncedBoundsChanged = useCallback(
    debounce((bounds: MapBounds) => {
      onBoundsChanged?.(bounds);
    }, 500),
    [onBoundsChanged]
  );

  // Handle place selection from search
  const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
    if (!map || !place.geometry?.location) return;

    // Pan and zoom to the selected location
    map.panTo(place.geometry.location);
    map.setZoom(13);

    // Get the new bounds and trigger the update
    const bounds = map.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      debouncedBoundsChanged({
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng()
      });
    }
  }, [map, debouncedBoundsChanged]);

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
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#E3F2FD' }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#F5F5F5' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add bounds changed listener
    newMap.addListener('bounds_changed', () => {
      const bounds = newMap.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        debouncedBoundsChanged({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng()
        });
      }
    });

    setMap(newMap);
    onMapLoaded?.(newMap);

    return () => {
      // Cleanup markers when component unmounts
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      markersRef.current = {};
    };
  }, [debouncedBoundsChanged, onMapLoaded]);

  useEffect(() => {
    if (!map || !yards.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Create markers for each yard
    yards.forEach(yard => {
      // Use provided coordinates if available, otherwise use city coordinates
      let position;
      if (yard.lat && yard.lng) {
        position = { lat: yard.lat, lng: yard.lng };
      } else {
        const coordinates = CITY_COORDINATES[yard.city] || CITY_COORDINATES['Santa Monica'];
        position = {
          lat: coordinates.lat + (Math.random() - 0.5) * 0.02,
          lng: coordinates.lng + (Math.random() - 0.5) * 0.02
        };
      }

      const marker = new google.maps.Marker({
        position,
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

      const infoWindowContent = document.createElement('div');
      infoWindowContent.className = 'yard-info-window';
      infoWindowContent.innerHTML = `
        <div style="
          width: 240px;
          padding: 12px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        ">
          <div style="
            position: relative;
            width: 100%;
            height: 140px;
            margin-bottom: 12px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <img 
              src="${yard.image}" 
              alt="${yard.title}" 
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
          </div>
          <div style="
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 8px;
            color: #1A1A1A;
          ">${yard.title}</div>
          <div style="
            color: #3A7D44;
            font-weight: 600;
            font-size: 18px;
          ">$${yard.price}/hour</div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        pixelOffset: new google.maps.Size(0, -5),
        maxWidth: 300,
      });

      let isInfoWindowOpen = false;
      let mouseOnInfoWindow = false;

      // Add click handler to the info window content
      infoWindowContent.addEventListener('click', () => {
        router.push(`/yards/${yard.id}`);
      });

      // Add event listener for InfoWindow DOM ready
      google.maps.event.addListener(infoWindow, 'domready', () => {
        const container = document.querySelector('.gm-style-iw-a');
        if (container) {
          container.addEventListener('mouseenter', () => {
            mouseOnInfoWindow = true;
          });
          container.addEventListener('mouseleave', () => {
            mouseOnInfoWindow = false;
            setTimeout(() => {
              if (!mouseOnInfoWindow && !isInfoWindowOpen) {
                infoWindow.close();
                setActiveInfoWindow(null);
              }
            }, 300);
          });
        }
      });

      marker.addListener('click', () => {
        if (activeInfoWindow) {
          activeInfoWindow.close();
        }
        infoWindow.open(map, marker);
        setActiveInfoWindow(infoWindow);
        isInfoWindowOpen = true;
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
        isInfoWindowOpen = false;
      });

      marker.addListener('mouseout', () => {
        setTimeout(() => {
          if (!mouseOnInfoWindow && !isInfoWindowOpen) {
            infoWindow.close();
            setActiveInfoWindow(null);
          }
        }, 300);
      });

      markersRef.current[yard.id] = marker;
    });
  }, [map, yards, onMarkerClick, router]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '400px',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        mb: 4,
        position: 'relative',
      }}
    >
      <MapSearchBar onPlaceSelected={handlePlaceSelected} />
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
} 