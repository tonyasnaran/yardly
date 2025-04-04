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
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        const favoriteIds = data.favorites;

        // Fetch yard details for each favorite
        const yardPromises = favoriteIds.map(async (id: number) => {
          const yardResponse = await fetch(`/api/yards/${id}`);
          if (!yardResponse.ok) {
            throw new Error(`Failed to fetch yard ${id}`);
          }
          return yardResponse.json();
        });

        const yardData = await Promise.all(yardPromises);
        setYards(yardData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load saved yards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session, router]);

  if (!session) {
    return null;
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
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          </Box>
        ) : yards.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Alert severity="info" sx={{ mt: 2 }}>
              You haven't saved any yards yet. Start exploring and save your favorites!
            </Alert>
          </Box>
        ) : (
          yards.map((yard) => (
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
          ))
        )}
      </Box>
    </Container>
  );
} 