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
} from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import { useRouter } from 'next/navigation';

interface Yard {
  id: number;
  title: string;
  city: string;
  price: number;
  guests: number;
  image: string;
  amenities: string[];
  rating?: number;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('');
  const [amenities, setAmenities] = useState('');
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchYards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/yards');
      if (!response.ok) {
        throw new Error('Failed to fetch yards');
      }
      const data = await response.json();
      // Ensure we're setting an array
      setYards(Array.isArray(data.yards) ? data.yards : []);
    } catch (err) {
      console.error('Error fetching yards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch yards');
      setYards([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYards();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchYards();
  };

  const handleYardClick = (id: number) => {
    router.push(`/yards/${id}`);
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yardly
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '23%' } }}>
              <TextField
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '23%' } }}>
              <FormControl fullWidth>
                <InputLabel>Guest Limit</InputLabel>
                <Select
                  value={guests}
                  label="Guest Limit"
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <MenuItem value="5">Up to 5 guests</MenuItem>
                  <MenuItem value="10">Up to 10 guests</MenuItem>
                  <MenuItem value="15">Up to 15 guests</MenuItem>
                  <MenuItem value="20">Up to 20 guests</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '23%' } }}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  value={amenities}
                  label="Amenities"
                  onChange={(e) => setAmenities(e.target.value)}
                >
                  <MenuItem value="grill">Grill</MenuItem>
                  <MenuItem value="pool">Pool</MenuItem>
                  <MenuItem value="firepit">Fire Pit</MenuItem>
                  <MenuItem value="playground">Playground</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '23%' } }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '100%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Yard Listings */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {loading ? (
            // Loading state
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
            // Error state
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Box>
          ) : yards.length === 0 ? (
            // Empty state
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Alert severity="info" sx={{ mt: 2 }}>
                No yards found. Try adjusting your search filters.
              </Alert>
            </Box>
          ) : (
            // Success state
            yards.map((yard) => (
              <Card 
                key={yard.id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                    boxShadow: 3
                  }
                }}
                onClick={() => router.push(`/yards/${yard.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={yard.image}
                  alt={yard.title}
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
                  <Typography variant="body2" color="text.secondary">
                    Up to {yard.guests} guests
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
} 