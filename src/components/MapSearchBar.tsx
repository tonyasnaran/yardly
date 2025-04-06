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
        top: 32,
        left: 32,
        zIndex: 1,
        width: '400px',
        backgroundColor: 'white',
        borderRadius: 2,
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.5,
          color: '#1A1A1A',
          fontWeight: 500,
        }}
      >
        Search Yards near You
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'white',
          border: '1px solid #E0E0E0',
          '&:hover': {
            borderColor: '#3A7D44',
          },
        }}
      >
        <SearchIcon
          sx={{
            p: 1,
            color: '#757575',
          }}
        />
        <InputBase
          inputRef={inputRef}
          placeholder="Enter a city..."
          sx={{
            ml: 1,
            flex: 1,
            '& input': {
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 500,
              '&::placeholder': {
                color: '#9E9E9E',
                opacity: 1,
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
} 