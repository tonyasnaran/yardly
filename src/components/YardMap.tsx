'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import MapSearchBar from './MapSearchBar';
import { supabase } from '@/lib/supabase';

// Update default center to Santa Monica/Mid-City area
const DEFAULT_CENTER = { lat: 34.0195, lng: -118.4912 }; // Santa Monica coordinates

// Sample coordinates for cities (you can adjust these)
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Malibu': { lat: 34.0259, lng: -118.7012 }, // Updated to be closer to Pepperdine/main Malibu
  'Santa Monica': { lat: 34.0195, lng: -118.4912 },
  'Mid City': { lat: 34.0511, lng: -118.3463 },
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

// Update SVG path for custom marker - simplified pin with house
const MARKER_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

// Update custom styles for InfoWindow
const INFO_WINDOW_STYLES = `
  .gm-style .gm-style-iw-c {
    padding: 0 !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
    max-width: 300px !important;
  }
  .gm-style .gm-style-iw-d {
    overflow: hidden !important;
    padding: 0 !important;
  }
  .gm-style .gm-style-iw-t::after {
    background: linear-gradient(45deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 51%, rgba(255,255,255,0) 100%) !important;
    box-shadow: rgba(0,0,0,0.12) -2px 2px 3px -1px !important;
  }
  .gm-style .gm-style-iw-tc::after {
    background: linear-gradient(45deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 51%, rgba(255,255,255,0) 100%);
  }
  .gm-style .gm-style-iw button.gm-ui-hover-effect {
    top: 8px !important;
    right: 8px !important;
    width: 26px !important;
    height: 26px !important;
    background: white !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    border: none !important;
    margin: 0 !important;
    z-index: 10 !important;
  }
  .gm-style .gm-style-iw button.gm-ui-hover-effect span {
    width: 16px !important;
    height: 16px !important;
    margin: 0 !important;
    position: relative !important;
  }
  .gm-style .gm-style-iw button.gm-ui-hover-effect span img {
    display: none !important;
  }
  .gm-style .gm-style-iw button.gm-ui-hover-effect span::before {
    content: '×' !important;
    font-size: 20px !important;
    line-height: 1 !important;
    color: #666 !important;
    font-weight: 300 !important;
    font-family: sans-serif !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }
  .gm-style .gm-style-iw button.gm-ui-hover-effect:hover span::before {
    color: #333 !important;
  }
  .yard-info-window {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  .yard-info-window:hover {
    opacity: 0.95;
  }
`;

// Update map styles to match the design
const MAP_STYLES = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1A1A1A' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#E0E0E0' }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#E0E0E0' }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#F5F5F5' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#E8F5E9' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#E8F5E9' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road.local',
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
  }
];

export default function YardMap({ 
  yards, 
  onMarkerClick, 
  onBoundsChanged,
  onMapLoaded 
}: YardMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.Marker }>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (!supabase) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: favs } = await supabase
          .from('favorites')
          .select('yard_id')
          .eq('user_id', session.user.id);

        if (favs) {
          setFavorites(new Set(favs.map(f => f.yard_id)));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (yardId: string, event: MouseEvent) => {
    event.stopPropagation();
    if (!supabase) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Redirect to sign in or show sign in modal
        return;
      }

      const newFavorites = new Set(favorites);
      if (newFavorites.has(yardId)) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('yard_id', yardId);
        newFavorites.delete(yardId);
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: session.user.id, yard_id: yardId }]);
        newFavorites.add(yardId);
      }
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Create InfoWindow content
  const createInfoWindowContent = (yard: any) => {
    const content = document.createElement('div');
    content.className = 'yard-info-window';
    content.innerHTML = `
      <div style="width: 300px;">
        <div style="position: relative;">
          <div style="width: 100%; height: 200px; overflow: hidden;">
            <img 
              src="${yard.image}" 
              alt="${yard.title}" 
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
        </div>
        <div style="padding: 16px;">
          <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #1A1A1A;">
            ${yard.title}
          </div>
          <div style="font-size: 18px; font-weight: 600; color: #3A7D44;">
            $${yard.price}/hour
          </div>
        </div>
      </div>
    `;

    // Add click handler for the content
    content.addEventListener('click', () => {
      router.push(`/yards/${yard.id}`);
    });

    return content;
  };

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

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || !window.google) {
        setError('Google Maps not loaded');
        return;
      }

      try {
        setIsLoading(true);

        // Add custom styles to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = INFO_WINDOW_STYLES;
        document.head.appendChild(styleSheet);

        // Calculate initial center
        let initialCenter = DEFAULT_CENTER;
        if (yards.length > 0) {
          const yardsWithCoords = yards.filter(yard => yard.lat && yard.lng);
          if (yardsWithCoords.length > 0) {
            const totalLat = yardsWithCoords.reduce((sum, yard) => sum + (yard.lat || 0), 0);
            const totalLng = yardsWithCoords.reduce((sum, yard) => sum + (yard.lng || 0), 0);
            initialCenter = {
              lat: totalLat / yardsWithCoords.length,
              lng: totalLng / yardsWithCoords.length
            };
          } else {
            const cityCounts = yards.reduce((acc, yard) => {
              acc[yard.city] = (acc[yard.city] || 0) + 1;
              return acc;
            }, {} as { [key: string]: number });

            const mostPopularCity = Object.entries(cityCounts)
              .sort(([,a], [,b]) => b - a)[0][0];

            initialCenter = CITY_COORDINATES[mostPopularCity] || DEFAULT_CENTER;
          }
        }

        // Initialize map
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 12,
          styles: MAP_STYLES,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          },
          gestureHandling: 'cooperative',
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
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      // Cleanup markers and styles
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      markersRef.current = {};
      const styleSheet = document.querySelector('style[data-map-styles]');
      if (styleSheet) {
        document.head.removeChild(styleSheet);
      }
    };
  }, [yards, debouncedBoundsChanged, onMapLoaded]);

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
          path: MARKER_PATH,
          fillColor: '#3A7D44',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 2,
          anchor: new google.maps.Point(12, 24),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(yard),
        maxWidth: 300,
      });

      let isInfoWindowOpen = false;
      let mouseOnInfoWindow = false;

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

      markersRef.current[yard.id] = marker;
    });
  }, [map, yards, onMarkerClick, router, favorites]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '600px',
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
        '& .gm-style-iw.gm-style-iw-c': {
          padding: 0,
        },
        '& .gm-style-iw-d': {
          overflow: 'hidden !important',
        },
      }}
    >
      <MapSearchBar onPlaceSelected={handlePlaceSelected} />
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          {error}
        </Box>
      )}
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
} 