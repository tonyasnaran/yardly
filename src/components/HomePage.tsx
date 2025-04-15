'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SearchBar from '@/components/SearchBar';
import YardMap from '@/components/YardMap';
import YardCard from '@/components/YardCard';

// Define the guest limit type
type GuestLimit = 'Up to 10 guests' | 'Up to 15 guests' | 'Up to 20 guests' | 'Up to 25 guests';

// Define the Yard interface
interface YardData {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  amenities?: string[];
  city?: string;
  rating?: number;
  reviews?: number;
  lat: number;
  lng: number;
  guest_limit: GuestLimit;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [yards, setYards] = useState<YardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch yards from Supabase
  const fetchYards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('yards')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setYards(data || []);
    } catch (error) {
      console.error('Error fetching yards:', error);
      setError('Failed to fetch yards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load favorites when session changes
  const loadFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoadingFavorites(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('yard_id')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setFavorites(data?.map(f => f.yard_id) || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    }
  };

  // Handle favorite toggling
  const handleFavoriteToggle = async (yardId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    try {
      const isFavorited = favorites.includes(yardId);
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('yard_id', parseInt(yardId));
        setFavorites(favorites.filter(id => id !== yardId));
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, yard_id: parseInt(yardId) });
        setFavorites([...favorites, yardId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data fetch
    fetchYards();
    loadFavorites();

    // Subscribe to yards table changes
    const yardsSubscription = supabase
      .channel('yards_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'yards'
        },
        (payload) => {
          console.log('New yard added:', payload);
          setYards(currentYards => [payload.new as YardData, ...currentYards]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'yards'
        },
        (payload) => {
          console.log('Yard updated:', payload);
          setYards(currentYards => 
            currentYards.map(yard => 
              yard.id === payload.new.id ? payload.new as YardData : yard
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'yards'
        },
        (payload) => {
          console.log('Yard deleted:', payload);
          setYards(currentYards => 
            currentYards.filter(yard => yard.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Subscribe to favorites changes
    const favoritesSubscription = supabase
      .channel('favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites'
        },
        (payload) => {
          console.log('Favorites change:', payload);
          loadFavorites();
        }
      )
      .subscribe();

    return () => {
      yardsSubscription.unsubscribe();
      favoritesSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading yards...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: '#3A7D44' }}>
        <Toolbar>
          {/* Empty toolbar to maintain the green header bar */}
        </Toolbar>
      </AppBar>

      {/* Hero Section with Search Bar */}
      <Box
        sx={{
          bgcolor: '#3A7D44',
          color: 'white',
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '25vh', sm: '30vh', md: '60vh' },
          position: 'relative',
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            py: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '100%',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
                color: 'white',
                overflow: 'visible',
                textOverflow: 'clip',
                mb: { xs: 2, md: 3 },
              }}
            >
              Your party, their yard
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/about')}
              sx={{
                bgcolor: 'white',
                color: '#3A7D44',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                px: { xs: 5, md: 6.5 },
                py: { xs: 1.5, md: 2.3 },
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: '50px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                mb: { xs: 2, md: 3 },
              }}
            >
              Discover How It Works
            </Button>
          </Box>
          
          {/* Search Bar */}
          <Box 
            sx={{ 
              width: '100%', 
              maxWidth: 900, 
              mx: 'auto',
              mt: { xs: 1, md: 2 },
            }}
          >
            <SearchBar />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Map Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#3A7D44' }}>
            Explore Yards Near You
          </Typography>
          <YardMap
            yards={yards.filter(yard => yard.lat && yard.lng).map(yard => ({
              id: yard.id.toString(),
              name: yard.name,
              price: yard.price,
              image_url: yard.image_url,
              city: yard.city || '',
              lat: yard.lat,
              lng: yard.lng
            }))}
            onMarkerClick={(id) => router.push(`/yards/${id}/book`)}
          />
        </Box>

        {/* Featured Yards Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 600,
              mb: 4,
              textAlign: 'center',
              color: 'text.primary'
            }}
          >
            Featured Yards
          </Typography>
          <Grid container spacing={4}>
            {yards.map((yard) => (
              <Grid item xs={12} sm={6} md={4} key={yard.id}>
                <YardCard
                  id={yard.id.toString()}
                  title={yard.name}
                  description={yard.description}
                  price={yard.price}
                  image={yard.image_url}
                  amenities={yard.amenities || []}
                  city={yard.city || ''}
                  guest_limit={yard.guest_limit || 'Up to 10 guests'}
                  isFavorite={favorites.includes(yard.id.toString())}
                  onFavoriteToggle={() => handleFavoriteToggle(yard.id.toString())}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
} 