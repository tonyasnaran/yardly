'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Divider,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import format from 'date-fns/format';

const GUEST_OPTIONS = [
  'Up to 10 Guests',
  'Up to 15 Guests',
  'Up to 20 Guests',
  'Up to 25 Guests',
  '25+ Guests',
];

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGuests, setSelectedGuests] = useState('');

  const handleGuestClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setGuestAnchorEl(event.currentTarget);
  };

  const handleGuestClose = () => {
    setGuestAnchorEl(null);
  };

  const handleGuestSelect = (option: string) => {
    setSelectedGuests(option);
    handleGuestClose();
  };

  const handleSearch = () => {
    // Extract the number from the guest option (e.g., "Up to 10 Guests" -> "10")
    const guestLimit = selectedGuests.match(/\d+/)?.[0] || '5';
    
    router.push(`/yards/results?city=${encodeURIComponent(city)}&checkIn=${checkIn?.toISOString()}&checkOut=${checkOut?.toISOString()}&guests=${guestLimit}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 900,
        borderRadius: '40px',
        p: '8px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
      }}
    >
      {/* Location Search */}
      <Box
        sx={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          px: 2,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
          Where
        </Typography>
        <InputBase
          placeholder="Search cities"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ color: '#222' }}
        />
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Check-in */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            flex: 1.5,
            display: 'flex',
            flexDirection: 'column',
            px: 2,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
            Check in
          </Typography>
          <DateTimePicker
            value={checkIn}
            onChange={(newValue) => setCheckIn(newValue)}
            format="MMM d, h:mm a"
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                placeholder: 'Add date & time',
              },
            }}
          />
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Check-out */}
        <Box
          sx={{
            flex: 1.5,
            display: 'flex',
            flexDirection: 'column',
            px: 2,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
            Check out
          </Typography>
          <DateTimePicker
            value={checkOut}
            onChange={(newValue) => setCheckOut(newValue)}
            format="MMM d, h:mm a"
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                placeholder: 'Add date & time',
              },
            }}
          />
        </Box>
      </LocalizationProvider>

      <Divider orientation="vertical" flexItem />

      {/* Guest Limit */}
      <Box
        onClick={handleGuestClick}
        sx={{
          flex: 1.5,
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          cursor: 'pointer',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#222' }}>
          Guest Limit
        </Typography>
        <Typography
          color={selectedGuests ? 'text.primary' : 'text.secondary'}
          sx={{ py: 1 }}
        >
          {selectedGuests || 'Add guests'}
        </Typography>
      </Box>

      <Menu
        anchorEl={guestAnchorEl}
        open={Boolean(guestAnchorEl)}
        onClose={handleGuestClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        {GUEST_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleGuestSelect(option)}
            sx={{
              py: 1.5,
              px: 3,
              '&:hover': { backgroundColor: '#f7f7f7' },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {/* Search Button */}
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          minWidth: '60px',
          height: '48px',
          borderRadius: '24px',
          backgroundColor: '#3A7D44',
          '&:hover': {
            backgroundColor: '#2D5F35',
          },
          ml: 2,
        }}
      >
        <SearchIcon />
      </Button>
    </Paper>
  );
} 