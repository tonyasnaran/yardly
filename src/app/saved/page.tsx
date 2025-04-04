'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  Alert,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';

interface Yard {
  id: number;
  title: string;
  city: string;
  price: number;
  guests: number;
  image: string;
  amenities: string[];
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      const fetchFavorites = async () => {
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            const favoriteIds = data.favorites || [];
            
            // Fetch yard details for each favorite
            const yardPromises = favoriteIds.map(async (id: number) => {
              const yardResponse = await fetch(`/api/yards/${id}`);
              if (yardResponse.ok) {
                return yardResponse.json();
              }
              return null;
            });

            const yardData = await Promise.all(yardPromises);
            setYards(yardData.filter(yard => yard !== null));
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setError('Failed to load saved yards');
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (yards.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Saved Yards
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No saved yards yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start exploring yards and save your favorites!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => router.push('/')}
          >
            Explore Yards
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Yards
      </Typography>
      <Grid container spacing={3}>
        {yards.map((yard) => (
          <Grid item xs={12} sm={6} md={4} key={yard.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={yard.image}
                alt={yard.title}
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/yards/${yard.id}`)}
              />
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
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`Up to ${yard.guests} guests`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {yard.amenities.slice(0, 3).map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push(`/yards/${yard.id}/book`)}
                >
                  Book Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 