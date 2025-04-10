'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  CardActionArea,
  Rating,
  Skeleton,
  Alert,
  Chip,
  Stack,
  Divider,
  OutlinedInput,
  IconButton,
  Grid,
} from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Group from '@mui/icons-material/Group';
import LocalActivity from '@mui/icons-material/LocalActivity';
import SearchBar from '@/components/SearchBar';
import YardMap from '@/components/YardMap';
import YardCard from '@/components/YardCard';
import { supabase } from '@/lib/supabaseClient';

// Define the guest limit type
type GuestLimit = 'Up to 10 guests' | 'Up to 15 guests' | 'Up to 20 guests' | 'Up to 25 guests';

// Define the Yard interface
interface YardData {
  id: string;
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

const AMENITY_OPTIONS = [
  { value: 'pool', label: 'Pool' },
  { value: 'bbq', label: 'BBQ' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'parking', label: 'Parking' },
  { value: 'restroom', label: 'Restroom' },
  { value: 'shade', label: 'Shade' },
  { value: 'seating', label: 'Seating' },
  { value: 'lighting', label: 'Lighting' },
];

const GUEST_OPTIONS = [
  { value: '5', label: 'Up to 5 guests' },
  { value: '10', label: 'Up to 10 guests' },
  { value: '15', label: 'Up to 15 guests' },
  { value: '20', label: 'Up to 20 guests' },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [yards, setYards] = useState<YardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [city, setCity] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

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
    if (session?.user?.id) {
      setIsLoadingFavorites(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('yard_id')
          .eq('user_id', session.user.id);

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
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      const isFavorited = favorites.includes(yardId);
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('yard_id', yardId);
        setFavorites(favorites.filter(id => id !== yardId));
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: session.user.id, yard_id: yardId });
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
          event: '*',
          schema: 'public',
          table: 'yards'
        },
        (payload) => {
          console.log('Yards table change:', payload);
          fetchYards(); // Refresh the yards list
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
          table: 'favorites',
          filter: `user_id=eq.${session?.user?.id}`
        },
        (payload) => {
          console.log('Favorites change:', payload);
          loadFavorites(); // Refresh favorites
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      yardsSubscription.unsubscribe();
      favoritesSubscription.unsubscribe();
    };
  }, [session?.user?.id]);

  // Add a new function for filtering yards
  const filterYards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use absolute URL in production
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://goyardly.com/api/yards' 
        : '/api/yards';
      
      // Prepare filter parameters
      const filterParams = {
        city: city || undefined,
        guests: selectedGuests.length > 0 ? selectedGuests[0] : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined
      };
      
      console.log('Filtering yards with params:', filterParams);
      
      // Only make a POST request if we have filters
      if (filterParams.city || filterParams.guests || filterParams.amenities) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
          body: JSON.stringify(filterParams),
        });
        
        console.log('Filter response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received filtered data:', data);
        
        if (data.error) {
          console.error('API error:', data.error);
          setError(data.error);
          setYards([]);
        } else {
          setYards(data.yards || []);
        }
      } else {
        // If no filters, just fetch all yards
        fetchYards();
      }
    } catch (error) {
      console.error('Error filtering yards:', error);
      setError('Failed to filter yards. Please try again later.');
      setYards([]);
    } finally {
      setLoading(false);
    }
  };

  // Update the filter handlers to use the new filterYards function
  const handleGuestChange = (event: any) => {
    setSelectedGuests(event.target.value);
    filterYards();
  };

  const handleAmenityChange = (event: any) => {
    setSelectedAmenities(event.target.value);
    filterYards();
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
    // Don't filter immediately on every keystroke, use debounce or call filterYards on blur
  };

  const handleCityBlur = () => {
    filterYards();
  };

  // Remove the client-side filtering since we're now using the API
  const filteredYards = yards;

  const handleYardClick = (yardId: string) => {
    router.push(`/yards/${yardId}`);
  };

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
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
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
            yards={yards}
            onMarkerClick={(id) => router.push(`/yards/${id}`)}
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
                  id={yard.id}
                  title={yard.name}
                  description={yard.description}
                  price={yard.price}
                  image={yard.image_url}
                  amenities={yard.amenities || []}
                  city={yard.city || ''}
                  guest_limit={yard.guest_limit || 'Up to 10 guests'}
                  isFavorite={favorites.includes(yard.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(yard.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
} 