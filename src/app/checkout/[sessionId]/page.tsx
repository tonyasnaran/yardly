'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();

  useEffect(() => {
    const redirectToStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: params.sessionId,
        });

        if (error) {
          console.error('Stripe checkout error:', error);
          router.push('/error');
        }
      } catch (error) {
        console.error('Error redirecting to Stripe:', error);
        router.push('/error');
      }
    };

    redirectToStripe();
  }, [params.sessionId, router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Redirecting to secure checkout...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we prepare your payment details.
        </Typography>
      </Box>
    </Container>
  );
} 