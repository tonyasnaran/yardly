'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'next/navigation';

interface Yard {
  id: number;
  title: string;
  city: string;
  price: number;
  guests: number;
  image: string;
  amenities: string[];
  description: string;
  rating: number;
  reviews: number;
  nearbyAttractions: string[];
}

export default function YardPage() {
  const params = useParams();
  const [yard, setYard] = useState<Yard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYardDetails = async () => {
      try {
        const id = params?.id;
        if (!id) return;

        const response = await fetch(`/api/yards/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch yard details');
        }
        const data = await response.json();
        setYard(data);
      } catch (error) {
        console.error('Error fetching yard details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYardDetails();
  }, [params?.id]);

  if (!yard) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {loading ? 'Loading...' : 'Yard not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {yard.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="subtitle1" color="text.secondary">
              {yard.city}
            </Typography>
          </Box>

          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="400"
              image={yard.image}
              alt={yard.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              About this space
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {yard.description}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {yard.amenities.map((amenity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'calc(50% - 8px)' }
                  }}
                >
                  <LocalActivityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">{amenity}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Nearby Attractions
            </Typography>
            <List>
              {yard.nearbyAttractions.map((attraction, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={attraction} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Booking Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '380px' } }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: '24px' },
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">${yard.price}/hour</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: 'primary.main', mr: 0.5 }} />
                <Typography variant="body1">
                  {yard.rating} ({yard.reviews} reviews)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <GroupIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body1">
                Up to {yard.guests} guests
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mb: 2 }}
            >
              Book Now
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              You won't be charged yet
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 