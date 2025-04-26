import { Suspense } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { HeroSection, EventCard, YardCard } from '@/components';
import MapSection from '@/components/MapSection';
import { Event } from '@/data/events';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getEvents() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return events;
}

async function getYards() {
  const { data: yards, error } = await supabase
    .from('yards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching yards:', error);
    return [];
  }

  return yards;
}

export default async function Home() {
  const [events, yards] = await Promise.all([getEvents(), getYards()]);

  // Prepare yards data for the map
  const mapYards = yards
    .filter(yard => yard.lat && yard.lng)
    .map(yard => ({
      id: yard.id.toString(),
      name: yard.name,
      price: yard.price,
      image_url: yard.image_url,
      city: yard.city || '',
      lat: yard.lat,
      lng: yard.lng
    }));

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>

      <Container maxWidth="lg">
        {/* Events Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: '#1A1A1A',
            }}
          >
            Upcoming Events
          </Typography>
          
          {events && events.length > 0 ? (
            <Grid container spacing={4}>
              {events.map((event: Event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#666',
              }}
            >
              No upcoming events at the moment. Check back soon!
            </Typography>
          )}
        </Box>

        {/* Map Section */}
        <MapSection yards={mapYards} />

        {/* Yards Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: '#1A1A1A',
            }}
          >
            Featured Yards
          </Typography>
          
          {yards && yards.length > 0 ? (
            <Grid container spacing={4}>
              {yards.map((yard) => (
                <Grid item xs={12} sm={6} md={4} key={yard.id}>
                  <YardCard
                    id={yard.id}
                    title={yard.name}
                    description={yard.description}
                    price={yard.price}
                    image={yard.image_url}
                    amenities={yard.amenities || []}
                    city={yard.city || ''}
                    guest_limit={yard.guest_limit}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#666',
              }}
            >
              No yards available at the moment. Check back soon!
            </Typography>
          )}
        </Box>
      </Container>
    </main>
  );
} 