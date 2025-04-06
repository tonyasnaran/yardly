'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Stack,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { format, parseISO } from 'date-fns';
import YardCard from '@/components/YardCard';
import YardMap from '@/components/YardMap';
import { MapBounds } from '@/components/YardMap';

interface Yard {
  id: number;
  title: string;
  city: string;
  price: number;
  guests: number;
  image: string;
  amenities: string[];
  rating?: number;
  description: string;
  reviews: number;
  nearbyAttractions: string[];
}

function LoadingFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
}

async function fetchYards(params: { [key: string]: string }) {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/yards/map?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch yards');
  }
  return response.json();
}

function YardResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [yards, setYards] = useState<Yard[]>([]);
  const [filteredYards, setFilteredYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [searchSummary, setSearchSummary] = useState('');
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Function to format the search summary
  const formatSearchSummary = (city: string, checkIn: string | null, checkOut: string | null, guests: string) => {
    let summary = [];

    // Add city if present
    if (city) {
      summary.push(city);
    }

    // Add date and time range if present
    if (checkIn && checkOut) {
      try {
        const checkInDate = parseISO(checkIn);
        const checkOutDate = parseISO(checkOut);
        const dateTimeRange = `${format(checkInDate, 'MMMM d')}, ${format(checkInDate, 'h:mm a')} to ${format(checkOutDate, 'h:mm a')}`;
        summary.push(dateTimeRange);
      } catch (error) {
        console.error('Error parsing dates:', error);
      }
    }

    // Add guest limit
    const guestText = `Up to ${guests} Guests`;
    summary.push(guestText);

    return summary.join(' | ');
  };

  const updateYards = useCallback(async (params: { [key: string]: string }) => {
    try {
      setLoading(true);
      const { yards: newYards } = await fetchYards(params);
      setYards(newYards);
    } catch (error) {
      console.error('Error fetching yards:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when search params change
  useEffect(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    updateYards(params);
  }, [searchParams, updateYards]);

  // Handle map bounds updates
  const handleBoundsChanged = useCallback((bounds: MapBounds) => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    params.north = bounds.north.toString();
    params.south = bounds.south.toString();
    params.east = bounds.east.toString();
    params.west = bounds.west.toString();
    updateYards(params);
  }, [searchParams, updateYards]);

  // Load favorites when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/favorites', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });
          
          if (response.ok) {
            const data = await response.json();
            setFavorites(data.yards.map((yard: Yard) => yard.id));
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setIsLoadingFavorites(false);
        }
      } else {
        setIsLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [status]);

  const toggleFavorite = async (yardId: number) => {
    if (status !== 'authenticated') {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yardId }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleApplyFilters = (filters: { amenities: string[]; priceRange: string }) => {
    const filtered = yards.filter((yard) => {
      // Check if yard has all selected amenities
      const amenitiesMatch = filters.amenities.length === 0 || 
        filters.amenities.every((amenity) => yard.amenities.includes(amenity));

      // Check if yard price is within range
      let priceMatch = true;
      switch (filters.priceRange) {
        case 'under-100':
          priceMatch = yard.price < 100;
          break;
        case '100-200':
          priceMatch = yard.price >= 100 && yard.price <= 200;
          break;
        case '200-plus':
          priceMatch = yard.price > 200;
          break;
        default:
          priceMatch = true;
      }

      return amenitiesMatch && priceMatch;
    });

    setFilteredYards(filtered);
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
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Search Bar Section */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1600px' }}>
          <SearchBar />
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth={false} sx={{ maxWidth: '1600px', py: 4 }}>
        {/* Search Summary */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#666',
            fontWeight: 500,
            mb: 3,
          }}
        >
          {searchSummary}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Results Count */}
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          {filteredYards.length} {filteredYards.length === 1 ? 'yard' : 'yards'} available
        </Typography>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Filter Panel */}
          <Grid item xs={12} md={2.5}>
            <FilterPanel onApplyFilters={handleApplyFilters} />
          </Grid>

          {/* Yard Results */}
          <Grid item xs={12} md={9.5}>
            <Grid container spacing={4}>
              {filteredYards.length === 0 ? (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No yards found matching your search criteria. Try adjusting your filters.
                  </Alert>
                </Grid>
              ) : (
                filteredYards.map((yard) => (
                  <Grid item key={yard.id} xs={12} sm={6} md={4} lg={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        maxHeight: '460px',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          transition: 'transform 0.2s ease-in-out',
                          boxShadow: 3
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(yard.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                            zIndex: 3,
                          }}
                        >
                          {favorites.includes(yard.id) ? (
                            <Favorite sx={{ color: '#3A7D44' }} />
                          ) : (
                            <FavoriteBorder sx={{ color: '#3A7D44' }} />
                          )}
                        </IconButton>
                        <CardMedia
                          component="img"
                          height="200"
                          image={yard.image}
                          alt={yard.title}
                          sx={{
                            objectFit: 'cover',
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                          <Box>
                            <Typography gutterBottom variant="h6" component="h2" sx={{ fontSize: '1.1rem' }}>
                              {yard.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                              <Chip 
                                label={`Up to ${yard.guests} guests`}
                                size="small"
                                sx={{ bgcolor: '#FFD166', color: '#3A7D44' }}
                              />
                              {yard.amenities.slice(0, 2).map((amenity) => (
                                <Chip
                                  key={amenity}
                                  label={amenity}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(58, 125, 68, 0.1)', color: '#3A7D44' }}
                                />
                              ))}
                              {yard.amenities.length > 2 && (
                                <Chip
                                  label={`+${yard.amenities.length - 2} more`}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(58, 125, 68, 0.1)', color: '#3A7D44' }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ mt: 'auto' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {yard.city}
                            </Typography>
                            <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: '1.2rem' }}>
                              ${yard.price}/hour
                            </Typography>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/yards/${yard.id}/book`);
                              }}
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
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box mt={4} mb={6}>
        <YardMap
          yards={yards}
          onBoundsChanged={handleBoundsChanged}
          onMapLoaded={setMapInstance}
        />
      </Box>
    </Box>
  );
}

export default function YardResults() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <YardResultsContent />
    </Suspense>
  );
} 