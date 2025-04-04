'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Yard {
  id: number;
  title: string;
  price: number;
  image: string;
  city: string;
  guests: number;
  amenities: string[];
  description: string;
  rating: number;
  reviews: number;
  nearbyAttractions: string[];
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            setYards(data.yards);
          } else {
            setError('Failed to load favorites');
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setError('An error occurred while loading favorites');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please sign in to view your saved yards.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/auth/signin')}
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mb: 2 }}
        >
          Go back to Home
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Saved Yards
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {yards.length === 0 ? (
        <Alert severity="info">
          You haven't saved any yards yet. Browse our yards and click the heart icon to save your favorites!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {yards.map((yard) => (
            <Grid item key={yard.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => router.push(`/yards/${yard.id}`)}
              >
                <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                  <Image
                    src={yard.image}
                    alt={yard.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {yard.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {yard.city}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${yard.price} per hour
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Up to {yard.guests} guests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 