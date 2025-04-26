'use client';

import { Container, Typography, Grid, Box } from '@mui/material';
import EventCard from '@/components/EventCard';
import YardMap from '@/components/YardMap';
import { events } from '@/data/events';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [yards, setYards] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchYards = async () => {
      const { data, error } = await supabase
        .from('yards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching yards:', error);
        return;
      }

      setYards(data || []);
    };

    fetchYards();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Upcoming Events
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {/* Map Section */}
      <Box sx={{ mt: 12, mb: 6 }}>
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
            lat: yard.lat,
            lng: yard.lng
          }))}
          onMarkerClick={(id) => window.location.href = `/yards/${id}/book`}
        />
      </Box>
    </Container>
  );
} 