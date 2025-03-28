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
  const router = useRouter();

  useEffect(() => {
    fetchYards();
  }, []);

  const fetchYards = async () => {
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (guests) params.append('guests', guests);
      if (amenities) params.append('amenities', amenities);

      const response = await fetch(`/api/yards?${params.toString()}`);
      const data = await response.json();
      setYards(data);
    } catch (error) {
      console.error('Error fetching yards:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {yards.map((yard) => (
            <Box key={yard.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.33% - 24px)' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea onClick={() => handleYardClick(yard.id)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={yard.image}
                    alt={yard.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {yard.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {yard.city}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={yard.rating || 4.5} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({yard.rating || 4.5})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${yard.price}/hour
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Up to {yard.guests} guests
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {yard.amenities.slice(0, 3).map((amenity, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ mr: 1 }}
                        >
                          • {amenity}
                        </Typography>
                      ))}
                      {yard.amenities.length > 3 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          • +{yard.amenities.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 