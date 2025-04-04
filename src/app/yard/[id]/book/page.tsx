'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Image from 'next/image';

interface BookingDetails {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface YardDetails {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function BookYardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yard, setYard] = useState<YardDetails | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  useEffect(() => {
    const fetchYardDetails = async () => {
      try {
        const response = await fetch(`/api/yards/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch yard details');
        }
        const data = await response.json();
        setYard(data);
      } catch (error) {
        console.error('Error fetching yard details:', error);
        setError('Failed to load yard details');
      }
    };

    fetchYardDetails();
  }, [params.id]);

  const handleReserve = async () => {
    console.log('Reserve button clicked');
    try {
      setLoading(true);
      setError(null);

      if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
        setError('Please select check-in and check-out times');
        return;
      }

      const requestBody = {
        yardId: params.id,
        checkIn: bookingDetails.checkIn.toISOString(),
        checkOut: bookingDetails.checkOut.toISOString(),
        guests: bookingDetails.guests,
      };

      console.log('Sending request with body:', requestBody);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Received response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data.sessionId) {
        throw new Error('No session ID returned from the server');
      }

      console.log('Redirecting to checkout with session ID:', data.sessionId);
      router.push(`/checkout/${data.sessionId}`);
    } catch (error) {
      console.error('Error in handleReserve:', error);
      setError(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const diff = bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60));
  };

  const hours = calculateHours();
  const baseRate = yard?.price || 50;
  const subtotal = baseRate * hours;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  if (!yard) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading yard details...</Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Book {yard.title}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Reservation Details
              </Typography>
              <Box sx={{ mb: 3 }}>
                <DateTimePicker
                  label="Check-in"
                  value={bookingDetails.checkIn}
                  onChange={(date) => setBookingDetails({ ...bookingDetails, checkIn: date })}
                  sx={{ width: '100%', mb: 2 }}
                />
                <DateTimePicker
                  label="Check-out"
                  value={bookingDetails.checkOut}
                  onChange={(date) => setBookingDetails({ ...bookingDetails, checkOut: date })}
                  sx={{ width: '100%' }}
                />
              </Box>
              <TextField
                label="Number of Guests"
                type="number"
                value={bookingDetails.guests}
                onChange={(e) => setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })}
                fullWidth
                sx={{ mb: 3 }}
                inputProps={{ min: 1 }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Price Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Base Rate</TableCell>
                      <TableCell align="right">
                        ${baseRate} × {hours} hours
                      </TableCell>
                      <TableCell align="right">${subtotal}</TableCell>
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
                onClick={handleReserve}
                disabled={loading || !bookingDetails.checkIn || !bookingDetails.checkOut}
                sx={{
                  mt: 3,
                  bgcolor: '#3A7D44',
                  '&:hover': {
                    bgcolor: '#2D5F35',
                  },
                }}
              >
                {loading ? 'Processing...' : 'Reserve Now'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
} 