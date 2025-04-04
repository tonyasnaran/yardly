'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';

// Initialize Stripe
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

  // Get booking details from session metadata
  const getBookingDetails = () => {
    // This would typically come from your backend or session storage
    // For now, we'll use mock data
    return {
      yardTitle: "Beachfront Garden Oasis",
      price: "$198.00",
      checkIn: "4/3/2025 10:00 AM",
      checkOut: "4/3/2025 2:00 PM",
      guests: 6,
      image: "/images/yards/Beachfront Garden Oasis.jpg"
    };
  };

  const bookingDetails = getBookingDetails();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          py: 8,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 200,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <Image
              src={bookingDetails.image}
              alt={bookingDetails.yardTitle}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </Box>
          <Typography variant="h5" component="h1" fontWeight="bold">
            {bookingDetails.yardTitle}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {bookingDetails.price}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Booking from {bookingDetails.checkIn} to {bookingDetails.checkOut} for {bookingDetails.guests} guests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Redirecting to secure checkout...
          </Typography>
        </Box>
      </Box>
    </Container>
  );
} 