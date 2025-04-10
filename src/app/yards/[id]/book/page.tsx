'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Image from 'next/image';

interface Yard {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  amenities: string[];
  city: string;
  guest_limit: 'Up to 10 guests' | 'Up to 15 guests' | 'Up to 20 guests' | 'Up to 25 guests';
}

// Helper function to parse guest limit string to number
const parseGuestLimit = (limit: string): number => {
  const match = limit.match(/\d+/);
  return match ? parseInt(match[0]) : 10; // Default to 10 if parsing fails
};

export default function BookYard() {
  const params = useParams();
  const router = useRouter();
  const [yard, setYard] = useState<Yard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchYardDetails = async () => {
      try {
        const response = await fetch(`/api/yard/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch yard details');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('Yard not found');
        }
        setYard(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchYardDetails();
    }
  }, [params.id]);

  const calculateHours = () => {
    if (!checkIn || !checkOut) return 0;
    const diffInMs = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60));
  };

  const calculateCost = () => {
    const hours = calculateHours();
    const baseRate = hours * (yard?.price || 0);
    const serviceFee = baseRate * 0.1; // 10% service fee
    return {
      baseRate,
      serviceFee,
      total: baseRate + serviceFee,
    };
  };

  const handleDecreaseGuests = () => {
    if (guestCount > 1) {
      setGuestCount(guestCount - 1);
    }
  };

  const handleIncreaseGuests = () => {
    if (yard && guestCount < parseGuestLimit(yard.guest_limit)) {
      setGuestCount(guestCount + 1);
    }
  };

  const handleCheckout = async () => {
    if (!yard || !checkIn || !checkOut) return;

    const hours = calculateHours();
    if (hours <= 0) {
      setError('Please select valid check-in and check-out times');
      return;
    }

    setIsSubmitting(true);
    try {
      const { baseRate, serviceFee, total } = calculateCost();
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yardId: yard.id,
          yardName: yard.name,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: guestCount,
          hours: hours,
          baseRate: baseRate,
          serviceFee: serviceFee,
          totalAmount: total,
          pricePerHour: yard.price,
          returnUrl: `${window.location.origin}/yards/${yard.id}/book`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      if (!data.sessionId) {
        throw new Error('No session ID received');
      }

      // Redirect to the checkout page with the session ID
      router.push(`/checkout/${data.sessionId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process checkout');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !yard) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Yard not found'}</Alert>
      </Container>
    );
  }

  const { baseRate, serviceFee, total } = calculateCost();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ position: 'relative', width: '100%', height: 400, mb: 3 }}>
              <Image
                src={yard.image_url}
                alt={yard.name}
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                priority
              />
            </Box>
            <Typography variant="h4" gutterBottom>
              {yard.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${yard.price} per hour
            </Typography>
            <Typography variant="body1" paragraph>
              {yard.description}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {yard.amenities.map((amenity, index) => (
                  <Chip key={index} label={amenity} />
                ))}
              </Box>
            </Box>
            <Typography variant="body1">
              <strong>Location:</strong> {yard.city}
            </Typography>
            <Typography variant="body1">
              <strong>Guest Limit:</strong> {yard.guest_limit}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h4" gutterBottom>
              {yard.name}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 4 }}>
              ${yard.price} per hour
            </Typography>

            <Box sx={{ mb: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 3 }}>
                  <DateTimePicker
                    label="Check-in"
                    value={checkIn}
                    onChange={(newValue) => setCheckIn(newValue)}
                    sx={{ width: '100%' }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <DateTimePicker
                    label="Check-out"
                    value={checkOut}
                    onChange={(newValue) => setCheckOut(newValue)}
                    sx={{ width: '100%' }}
                  />
                </Box>
              </LocalizationProvider>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleDecreaseGuests}
                    disabled={guestCount <= 1}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                      color: 'text.primary'
                    }}
                  >
                    -
                  </Button>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      flex: 1, 
                      textAlign: 'center',
                      fontWeight: 500
                    }}
                  >
                    {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleIncreaseGuests}
                    disabled={!yard || guestCount >= parseGuestLimit(yard.guest_limit)}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                      color: 'text.primary'
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    mt: 1 
                  }}
                >
                  Maximum {yard.guest_limit}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h5" gutterBottom>
              Reservation Details
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Base Rate</TableCell>
                    <TableCell align="right">
                      ${yard.price} × {calculateHours()} hours
                    </TableCell>
                    <TableCell align="right">${baseRate.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Service Fee</TableCell>
                    <TableCell align="right">10%</TableCell>
                    <TableCell align="right">${serviceFee.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        ${total.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              disabled={!checkIn || !checkOut || isSubmitting || calculateHours() <= 0}
              sx={{
                mt: 3,
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(58, 125, 68, 0.5)',
                  color: 'white',
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Reserve Now'}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              You won't be charged until the host accepts your booking
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 