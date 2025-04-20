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
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

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

const HeroSection = () => {
  const router = useRouter();
  const [mapPinData, setMapPinData] = useState(null);

  useEffect(() => {
    // Load map pin animation
    const loadAnimation = async () => {
      try {
        const response = await fetch('/lotties/map pin.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animationData = await response.json();
        setMapPinData(animationData);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadAnimation();
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '90vh', md: '100vh' },
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/videos/9sec Rooftop Stock Video.mp4" type="video/mp4" />
        <source src="/videos/9sec Rooftop Stock Video WEBM.webm" type="video/webm" />
      </video>

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          gap: { xs: 4, md: 6 },
          pt: { xs: 4, md: 0 },
        }}
      >
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
                color: '#59C36A',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '0.02em',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Find Your Perfect Outdoor Space
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                color: 'white',
                textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                letterSpacing: '0.01em',
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                lineHeight: 1.4,
              }}
            >
              Discover and book unique outdoor spaces for your next gathering
            </Typography>
          </motion.div>
        </Box>

        {mapPinData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Lottie
              animationData={mapPinData}
              play
              loop
              style={{ width: 200, height: 200 }}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          <Box
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: '#333',
                '&::placeholder': {
                  color: '#666',
                  opacity: 1,
                },
              },
              '& .MuiButton-root': {
                backgroundColor: '#59C36A',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(89, 195, 106, 0.3)',
                '&:hover': {
                  backgroundColor: '#4BA459',
                  boxShadow: '0 6px 16px rgba(89, 195, 106, 0.4)',
                },
              },
            }}
          >
            <SearchBar />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

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
          .eq('yard_id', parseInt(yardId));
        setFavorites(favorites.filter(id => id !== yardId));
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: session.user.id, yard_id: parseInt(yardId) });
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
          // Prepend new yard to the list
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
          // Update the yard in place
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
          // Remove the yard from the list
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
    <ParallaxProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <HeroSection />
        
        {/* Map Section */}
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 10, md: 12 },
            mt: { xs: 4, md: 6 }
          }}
        >
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
                lat: yard.lat!,
                lng: yard.lng!
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
    </ParallaxProvider>
  );
} 