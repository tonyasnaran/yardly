'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Image from 'next/image';

interface Yard {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [yard, setYard] = useState<Yard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYardDetails = async () => {
      try {
        const response = await fetch(`/api/yard/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch yard details');
        }
        const data = await response.json();
        setYard(data);
      } catch (error) {
        console.error('Error fetching yard details:', error);
        setError('Failed to load yard details');
      } finally {
        setLoading(false);
      }
    };

    fetchYardDetails();
  }, [params.id]);

  const handleReserve = async () => {
    if (!checkIn || !checkOut || !guests) {
      setBookingError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yardId: params.id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      router.push(`/checkout/${sessionId}`);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading yard details...</Typography>
      </Container>
    );
  }

  if (error || !yard) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error || 'Yard not found'}</Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
            <Image
              src={yard.image}
              alt={yard.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {yard.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${yard.price} per hour
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ my: 3 }}>
                <DatePicker
                  label="Check-in"
                  value={checkIn}
                  onChange={(newValue) => setCheckIn(newValue)}
                  sx={{ width: '100%', mb: 2 }}
                />
                <DatePicker
                  label="Check-out"
                  value={checkOut}
                  onChange={(newValue) => setCheckOut(newValue)}
                  sx={{ width: '100%', mb: 2 }}
                />
                <TextField
                  label="Number of Guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Box>
            </LocalizationProvider>

            {bookingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bookingError}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleReserve}
              sx={{
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
              }}
            >
              Reserve Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 