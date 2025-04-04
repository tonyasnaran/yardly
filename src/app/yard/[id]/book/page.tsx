'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface BookingDetails {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

export default function BookYardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const handleReserve = async () => {
    try {
      // Get the base URL from environment variable or use relative path
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yardId: params.id,
          checkIn: bookingDetails.checkIn?.toISOString(),
          checkOut: bookingDetails.checkOut?.toISOString(),
          guests: bookingDetails.guests,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('No session ID returned from the server');
      }

      console.log('Redirecting to checkout with session ID:', sessionId);
      router.push(`/checkout/${sessionId}`);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // You might want to show an error message to the user here
    }
  };

  const calculateHours = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const diff = bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60));
  };

  const baseRate = 50; // Replace with actual yard rate
  const hours = calculateHours();
  const subtotal = baseRate * hours;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Book Your Yard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Reservation Details
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            </LocalizationProvider>
            <TextField
              label="Number of Guests"
              type="number"
              value={bookingDetails.guests}
              onChange={(e) => setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })}
              fullWidth
              sx={{ mb: 3 }}
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
              disabled={!bookingDetails.checkIn || !bookingDetails.checkOut}
              sx={{
                mt: 3,
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