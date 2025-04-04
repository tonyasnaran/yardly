'use client';

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const router = useRouter();
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setYards(data.favorites || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load saved yards');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session, router]);

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Saved Yards
        </Typography>
        <Grid container spacing={3}>
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          color: '#3A7D44',
          fontWeight: 'bold',
        }}
      >
        Saved Yards
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {yards.map((yard) => (
          <Card 
            key={yard.id}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: 3
              }
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <Favorite sx={{ color: '#3A7D44' }} />
            </IconButton>

            <CardMedia
              component="img"
              height="200"
              image={yard.image}
              alt={yard.title}
              onClick={() => router.push(`/yards/${yard.id}`)}
              sx={{ cursor: 'pointer' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2">
                {yard.title}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`Up to ${yard.guests} guests`}
                  size="small"
                  sx={{ bgcolor: '#FFD166', color: '#3A7D44' }}
                />
                {yard.amenities.slice(0, 3).map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    size="small"
                    sx={{ bgcolor: 'rgba(58, 125, 68, 0.1)', color: '#3A7D44' }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {yard.city}
              </Typography>
              <Typography variant="h6" color="primary">
                ${yard.price}/hour
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push(`/yards/${yard.id}/book`)}
                sx={{
                  bgcolor: '#3A7D44',
                  '&:hover': {
                    bgcolor: '#2D5F35',
                  },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
} 