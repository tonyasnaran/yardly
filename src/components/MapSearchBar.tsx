import { useEffect, useRef, useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface MapSearchBarProps {
  onPlaceSelect: (lat: number, lng: number) => void;
}

export default function MapSearchBar({ onPlaceSelect }: MapSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const handleGoogleMapsReady = () => {
      if (window.google?.maps?.places) {
        setIsGoogleLoaded(true);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
    }

    // Listen for the custom event from GoogleMapsScript
    window.addEventListener('google-maps-ready', handleGoogleMapsReady);

    return () => {
      window.removeEventListener('google-maps-ready', handleGoogleMapsReady);
    };
  }, []);

  useEffect(() => {
    if (isGoogleLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        // Initialize Google Places Autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
          fields: ['geometry', 'formatted_address'],
        });

        // Add place_changed event listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            onPlaceSelect(lat, lng);
          }
        });
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleLoaded, onPlaceSelect]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '400px',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <InputBase
        inputRef={inputRef}
        placeholder="Search for a city..."
        sx={{
          flex: 1,
          px: 2,
          py: 1,
          '& input': {
            fontSize: '0.9rem',
          },
        }}
      />
      <IconButton
        sx={{
          p: '10px',
          color: '#666',
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
} 