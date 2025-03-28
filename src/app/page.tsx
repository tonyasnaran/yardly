'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
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
} from '@mui/material';

interface Yard {
  id: number;
  title: string;
  city: string;
  price: number;
  guests: number;
  image: string;
  amenities: string[];
}

export default function Home() {
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('');
  const [amenities, setAmenities] = useState('');
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
          </Grid>
        </Box>

        {/* Yard Listings */}
        <Grid container spacing={3}>
          {yards.map((yard) => (
            <Grid item xs={12} sm={6} md={4} key={yard.id}>
              <Card>
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
                  <Typography variant="body2" color="text.secondary">
                    {yard.city}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${yard.price}/hour
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Up to {yard.guests} guests
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {yard.amenities.map((amenity, index) => (
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 