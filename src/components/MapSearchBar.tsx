import { useEffect, useRef } from 'react';
import { Box, InputBase, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface MapSearchBarProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

export default function MapSearchBar({ onPlaceSelected }: MapSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['geometry', 'formatted_address'],
    });

    // Add place_changed event listener
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.geometry?.location) {
        onPlaceSelected(place);
      }
    });

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelected]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
        width: '300px',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: '#1A1A1A',
        }}
      >
        Search Yards near You
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'white',
          '&:hover': {
            boxShadow: 3,
          },
        }}
      >
        <SearchIcon
          sx={{
            p: 1,
            color: '#3A7D44',
          }}
        />
        <InputBase
          inputRef={inputRef}
          placeholder="Enter a city..."
          sx={{
            ml: 1,
            flex: 1,
            '& input': {
              py: 1,
              fontSize: '0.95rem',
              '&::placeholder': {
                color: '#666',
                opacity: 1,
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
} 