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

const AMENITY_OPTIONS = [
  { value: 'grill', label: 'Grill' },
  { value: 'pool', label: 'Pool' },
  { value: 'firepit', label: 'Fire Pit' },
  { value: 'playground', label: 'Playground' },
  { value: 'hottub', label: 'Hot Tub' },
  { value: 'outdoor_kitchen', label: 'Outdoor Kitchen' },
];

const GUEST_OPTIONS = [
  { value: '5', label: 'Up to 5 guests' },
  { value: '10', label: 'Up to 10 guests' },
  { value: '15', label: 'Up to 15 guests' },
  { value: '20', label: 'Up to 20 guests' },
];

export default function Home() {
  const [city, setCity] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
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
      setYards(Array.isArray(data.yards) ? data.yards : []);
    } catch (err) {
      console.error('Error fetching yards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch yards');
      setYards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYards();
  }, []);

  const handleGuestToggle = (value: string) => {
    setSelectedGuests(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleAmenityToggle = (value: string) => {
    setSelectedAmenities(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const filteredYards = yards.filter(yard => {
    const matchesGuests = selectedGuests.length === 0 || 
      selectedGuests.includes(yard.guests.toString());
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.some(amenity => yard.amenities.includes(amenity));
    const matchesCity = !city || 
      yard.city.toLowerCase().includes(city.toLowerCase());
    
    return matchesGuests && matchesAmenities && matchesCity;
  });

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
          <TextField
            fullWidth
            label="Search by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {/* Guest Limit Tags */}
          <Typography variant="subtitle1" sx={{ mb: 1, color: '#3A7D44' }}>
            Guest Limit
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {GUEST_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleGuestToggle(option.value)}
                color={selectedGuests.includes(option.value) ? 'primary' : 'default'}
                sx={{
                  bgcolor: selectedGuests.includes(option.value) ? '#3A7D44' : 'transparent',
                  color: selectedGuests.includes(option.value) ? 'white' : '#3A7D44',
                  borderColor: '#3A7D44',
                  '&:hover': {
                    bgcolor: selectedGuests.includes(option.value) ? '#2D5F35' : 'rgba(58, 125, 68, 0.1)',
                  },
                }}
              />
            ))}
          </Stack>

          {/* Amenities Tags */}
          <Typography variant="subtitle1" sx={{ mb: 1, color: '#3A7D44' }}>
            Amenities
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {AMENITY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleAmenityToggle(option.value)}
                color={selectedAmenities.includes(option.value) ? 'primary' : 'default'}
                sx={{
                  bgcolor: selectedAmenities.includes(option.value) ? '#3A7D44' : 'transparent',
                  color: selectedAmenities.includes(option.value) ? 'white' : '#3A7D44',
                  borderColor: '#3A7D44',
                  '&:hover': {
                    bgcolor: selectedAmenities.includes(option.value) ? '#2D5F35' : 'rgba(58, 125, 68, 0.1)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Featured Yards Section */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3, 
            color: '#3A7D44',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          Featured Yards
        </Typography>

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
          ) : filteredYards.length === 0 ? (
            // Empty state
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Alert severity="info" sx={{ mt: 2 }}>
                No yards found. Try adjusting your search filters.
              </Alert>
            </Box>
          ) : (
            // Success state
            filteredYards.map((yard) => (
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
                    {yard.amenities.length > 3 && (
                      <Chip
                        label={`+${yard.amenities.length - 3} more`}
                        size="small"
                        sx={{ bgcolor: 'rgba(58, 125, 68, 0.1)', color: '#3A7D44' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {yard.city}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${yard.price}/hour
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