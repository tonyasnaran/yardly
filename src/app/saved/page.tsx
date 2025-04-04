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
} from '@mui/material';
import Image from 'next/image';

interface Yard {
  id: number;
  title: string;
  price: number;
  image: string;
  city: string;
  guests: number;
  amenities: string[];
}

export default function SavedPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [favoriteYards, setFavoriteYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteYards = async () => {
      if (status === 'loading') return;

      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavoriteYards(data.favorites || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load saved yards');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteYards();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading saved yards...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to view your saved yards
        </Typography>
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

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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

  if (favoriteYards.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          You haven't saved any yards yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Browse our yards and click the heart icon to save your favorites
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Browse Yards
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Your Saved Yards
      </Typography>
      <Grid container spacing={4}>
        {favoriteYards.map((yard) => (
          <Grid item key={yard.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  transition: 'all 0.2s ease-in-out',
                },
              }}
              onClick={() => router.push(`/yards/${yard.id}`)}
            >
              <Box sx={{ position: 'relative', pt: '56.25%' }}>
                <CardMedia
                  component="img"
                  image={yard.image}
                  alt={yard.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {yard.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {yard.city}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${yard.price}/hour
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 