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
  const [totalHours, setTotalHours] = useState(0);
  const [baseRate, setBaseRate] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

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

  useEffect(() => {
    if (checkIn && checkOut) {
      const hours = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
      setTotalHours(hours);
      const base = hours * (yard?.price || 0);
      setBaseRate(base);
      const fee = Math.round(base * 0.1); // 10% service fee
      setServiceFee(fee);
      setTotalCost(base + fee);
    } else {
      setTotalHours(0);
      setBaseRate(0);
      setServiceFee(0);
      setTotalCost(0);
    }
  }, [checkIn, checkOut, yard?.price]);

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
                <DateTimePicker
                  label="Check-in"
                  value={checkIn}
                  onChange={(newValue) => setCheckIn(newValue)}
                  sx={{ width: '100%', mb: 2 }}
                />
                <DateTimePicker
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

            <Typography variant="h6" sx={{ mb: 2 }}>
              Reservation Details
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Base Rate</TableCell>
                    <TableCell align="right">
                      ${yard.price} × {totalHours} hours
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
                        ${totalCost.toFixed(2)}
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
              onClick={handleReserve}
              disabled={!checkIn || !checkOut || totalHours === 0}
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
              Reserve Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 