'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID provided');
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Failed to verify payment. Please contact support.');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Verifying your payment...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ mt: 3 }}
          >
            Return Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon
          sx={{
            fontSize: 60,
            color: 'success.main',
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your booking. We've sent a confirmation email with all the details.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{
            bgcolor: '#3A7D44',
            '&:hover': {
              bgcolor: '#2D5F35',
            },
          }}
        >
          Return Home
        </Button>
      </Paper>
    </Container>
  );
} 