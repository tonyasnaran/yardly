'use client';

import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useParams } from 'next/navigation';
import { events } from '@/data/events';
import Image from 'next/image';

export default function EventPage() {
  const params = useParams();
  const event = events.find(e => e.id === params.id);

  if (!event) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4">Event not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  color: '#3A7D44',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {event.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                {event.date} • {event.details.time}
              </Typography>
            </Box>

            <Box sx={{ mb: 6, position: 'relative', height: 400, borderRadius: 2, overflow: 'hidden' }}>
              <Image
                src={event.image}
                alt={event.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>

            <Paper sx={{ p: 4, mb: 6, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                About the Event
              </Typography>
              <Typography variant="body1" paragraph>
                {event.details.fullDescription}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 2, position: 'sticky', top: 24 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Event Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {event.date} at {event.details.time}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Organizer
                </Typography>
                <Typography variant="body1">
                  {event.details.organizer}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Capacity
                </Typography>
                <Typography variant="body1">
                  {event.details.capacity} attendees
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="body1">
                  {event.details.price}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                href={event.details.registrationLink}
                target="_blank"
                sx={{
                  backgroundColor: '#3A7D44',
                  '&:hover': {
                    backgroundColor: '#2d5f35',
                  },
                }}
              >
                Register Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 