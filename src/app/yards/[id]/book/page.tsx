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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

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

export default function BookingPage() {
  const params = useParams();
  const [yard, setYard] = useState<Yard | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [baseRate, setBaseRate] = useState(0);

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

  useEffect(() => {
    if (checkIn && checkOut && yard) {
      const hours = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
      setTotalHours(hours);
      setBaseRate(hours * yard.price);
    }
  }, [checkIn, checkOut, yard]);

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

        {/* Reservation Details Sidebar */}
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
            <Typography variant="h5" gutterBottom>
              Reservation Details
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3} sx={{ mb: 3 }}>
                <DateTimePicker
                  label="Check-in"
                  value={checkIn}
                  onChange={(newValue) => setCheckIn(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 }
                    }
                  }}
                />
                <DateTimePicker
                  label="Check-out"
                  value={checkOut}
                  onChange={(newValue) => setCheckOut(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 }
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Time Slot
                    </TableCell>
                    <TableCell align="right">
                      {checkIn && checkOut ? (
                        <Box>
                          <Typography variant="body2">
                            Check-in: {format(checkIn, 'MMM d, h:mm a')}
                          </Typography>
                          <Typography variant="body2">
                            Check-out: {format(checkOut, 'MMM d, h:mm a')}
                          </Typography>
                        </Box>
                      ) : (
                        'Select dates'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Base Rate
                    </TableCell>
                    <TableCell align="right">
                      {totalHours > 0 ? (
                        <Typography>
                          ${yard.price} × {totalHours} hours = ${baseRate}
                        </Typography>
                      ) : (
                        'Select dates'
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                mt: 3,
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
              }}
            >
              Confirm Booking
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 