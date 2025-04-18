'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Paper,
  InputBase,
  Divider,
  Box,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useRouter } from 'next/navigation';
import DatePickerProvider from './DatePickerProvider';
import { format } from 'date-fns';

const GUEST_OPTIONS = [
  'Up to 10 Guests',
  'Up to 15 Guests',
  'Up to 20 Guests',
  'Up to 25 Guests',
  '25+ Guests',
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          onPlaceSelect?: (e: CustomEvent<google.maps.places.PlaceResult>) => void;
        },
        HTMLElement
      >;
    }
  }
}

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(GUEST_OPTIONS[0]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGoogleMapsReady = () => {
      if (window.google?.maps?.places) {
        setPlacesLoaded(true);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      setPlacesLoaded(true);
    }

    // Listen for the custom event from GoogleMapsScript
    window.addEventListener('google-maps-ready', handleGoogleMapsReady);

    return () => {
      window.removeEventListener('google-maps-ready', handleGoogleMapsReady);
    };
  }, []);

  useEffect(() => {
    if (placesLoaded && autocompleteRef.current) {
      const element = autocompleteRef.current;
      
      // Apply custom styles to remove the black bar
      const style = document.createElement('style');
      style.textContent = `
        gmp-place-autocomplete {
          width: 100%;
          border: none !important;
          outline: none !important;
          font-family: inherit;
          font-size: inherit;
          background: transparent !important;
        }
        gmp-place-autocomplete input[aria-autocomplete="list"] {
          width: 100% !important;
          padding: 8px 0 !important;
          border: none !important;
          outline: none !important;
          font-family: inherit !important;
          font-size: inherit !important;
          color: inherit !important;
          background: transparent !important;
          box-shadow: none !important;
          -webkit-appearance: none !important;
        }
        gmp-place-autocomplete input[aria-autocomplete="list"]:focus {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        gmp-place-autocomplete input[aria-autocomplete="list"]::placeholder {
          color: #757575;
          opacity: 1;
        }
        gmp-place-autocomplete div {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);

      // Wait for the element to be fully initialized
      const checkForInput = setInterval(() => {
        const input = element.querySelector('input');
        if (input) {
          clearInterval(checkForInput);
          // Add event listener for place selection
          element.addEventListener('place_changed', (e: CustomEvent<google.maps.places.PlaceResult>) => {
            const place = e.detail;
            if (place?.formatted_address) {
              setCity(place.formatted_address);
              setError(null);
            }
          });
        }
      }, 100);

      return () => {
        clearInterval(checkForInput);
        document.head.removeChild(style);
      };
    }
  }, [placesLoaded]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out times');
      return false;
    }

    if (checkIn >= checkOut) {
      setError('Check-out time must be after check-in time');
      return false;
    }

    const minDuration = 1000 * 60 * 60; // 1 hour in milliseconds
    if (checkOut.getTime() - checkIn.getTime() < minDuration) {
      setError('Booking must be at least 1 hour');
      return false;
    }

    const maxDuration = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    if (checkOut.getTime() - checkIn.getTime() > maxDuration) {
      setError('Booking cannot exceed 24 hours');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSearch = () => {
    if (!city) {
      setError('Please select a location');
      return;
    }

    if (!validateDates()) {
      return;
    }

    const params = new URLSearchParams();
    params.append('city', city);
    params.append('checkIn', checkIn!.toISOString());
    params.append('checkOut', checkOut!.toISOString());
    params.append('guests', guests.split(' ')[2]); // Extract number from "Up to X Guests"

    router.push(`/yards/results?${params.toString()}`);
  };

  const open = Boolean(anchorEl);

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        width: '100%',
        maxWidth: 900,
        borderRadius: { xs: '24px', md: '40px' },
        p: { xs: '16px', md: '8px' },
        backgroundColor: 'white',
        border: '1px solid #ddd',
        gap: { xs: 2, md: 0 },
      }}
      elevation={3}
    >
      <Box
        sx={{
          flex: { md: 2 },
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          minWidth: { xs: '100%', md: '200px' },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
          Where
        </Typography>
        <InputBase
          inputRef={autocompleteRef}
          placeholder="Search cities"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{
            '& input': {
              py: 1,
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              color: 'inherit',
              bgcolor: 'transparent',
              '&::placeholder': {
                color: '#757575',
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

      <DatePickerProvider>
        <Box
          sx={{
            flex: { md: 1.5 },
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
            Check in
          </Typography>
          <DateTimePicker
            value={checkIn}
            onChange={(newValue) => {
              setCheckIn(newValue);
              setError(null);
            }}
            format="MMM d, h:mm a"
            minDate={new Date()}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                placeholder: 'Add date & time',
                sx: {
                  width: '100%',
                },
              },
            }}
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

        <Box
          sx={{
            flex: { md: 1.5 },
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
            Check out
          </Typography>
          <DateTimePicker
            value={checkOut}
            onChange={(newValue) => {
              setCheckOut(newValue);
              setError(null);
            }}
            format="MMM d, h:mm a"
            minDate={checkIn || new Date()}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                placeholder: 'Add date & time',
                sx: {
                  width: '100%',
                },
              },
            }}
          />
        </Box>
      </DatePickerProvider>

      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

      <Box
        sx={{
          flex: { md: 1.5 },
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
          Guest Limit
        </Typography>
        <Button
          onClick={handleClick}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            justifyContent: 'flex-start',
            pl: 0,
            width: '100%',
          }}
        >
          {guests}
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              borderRadius: 2,
            },
          }}
        >
          <List sx={{ width: 200 }}>
            {GUEST_OPTIONS.map((option) => (
              <ListItem
                button
                key={option}
                onClick={() => {
                  setGuests(option);
                  handleClose();
                }}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': { backgroundColor: '#f7f7f7' },
                }}
              >
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 1 },
          py: { xs: 1, md: 0 },
        }}
      >
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{
            width: '100%',
            height: 48,
            borderRadius: '24px',
            backgroundColor: '#3A7D44',
            '&:hover': {
              backgroundColor: '#2D5F35',
            },
            px: { xs: 4, md: 3 },
          }}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Typography
          color="error"
          sx={{
            position: 'absolute',
            bottom: -30,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </Typography>
      )}
    </Paper>
  );
} 