import { Box, Container, Typography, Grid, Button, Avatar, Chip, Paper } from '@mui/material';
import Image from 'next/image';
import EventMap from '@/components/EventMap';
import ContactHostModal from '@/components/ContactHostModal';
import { getEventById } from '@/lib/supabase/events';
import { notFound } from 'next/navigation';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const eventData = await getEventById(params.id);
  
  if (!eventData) {
    notFound();
  }

  const { event, hosts } = eventData;

  // Generate unique mock hosts for each event
  function getMockHosts(event: any) {
    // Use event id or name to generate different hosts
    const base = (event.name || event.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (base.includes('usc') || base.includes('ucla')) {
      return [
        {
          id: 'mock1',
          full_name: 'Jessica Lee',
          email: 'jessica.usc@gmail.com',
          avatar_url: '',
          role: 'Event Organizer',
        },
        {
          id: 'mock2',
          full_name: 'Brian Kim',
          email: 'brian.ucla@gmail.com',
          avatar_url: '',
          role: 'Community Manager',
        },
      ];
    }
    if (base.includes('garden')) {
      return [
        {
          id: 'mock1',
          full_name: 'Emily Green',
          email: 'emily.garden@gmail.com',
          avatar_url: '',
          role: 'Workshop Leader',
        },
        {
          id: 'mock2',
          full_name: 'Carlos Rivera',
          email: 'carlos.garden@gmail.com',
          avatar_url: '',
          role: 'Community Volunteer',
        },
      ];
    }
    if (base.includes('sale')) {
      return [
        {
          id: 'mock1',
          full_name: 'Linda Tran',
          email: 'linda.sale@gmail.com',
          avatar_url: '',
          role: 'Sale Coordinator',
        },
        {
          id: 'mock2',
          full_name: 'David Patel',
          email: 'david.sale@gmail.com',
          avatar_url: '',
          role: 'Vendor Manager',
        },
      ];
    }
    // Default
    return [
      {
        id: 'mock1',
        full_name: 'Alex Morgan',
        email: 'alex.event@gmail.com',
        avatar_url: '',
        role: 'Event Host',
      },
      {
        id: 'mock2',
        full_name: 'Taylor Smith',
        email: 'taylor.event@gmail.com',
        avatar_url: '',
        role: 'Support Staff',
      },
    ];
  }

  const displayHosts = hosts.length > 0 ? hosts : getMockHosts(event);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Hero Image */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 220, md: 340 } }}>
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {event.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Chip
                label={new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                sx={{ bgcolor: '#e6f4ea', color: '#3A7D44', fontWeight: 500, fontSize: '1rem', borderRadius: 2 }}
              />
              <Chip
                label={event.location}
                sx={{ bgcolor: '#e6f0fa', color: '#2d5f8b', fontWeight: 500, fontSize: '1rem', borderRadius: 2 }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{ color: '#444', lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}
            >
              {event.description}
            </Typography>
            {/* Map directly under description */}
            <EventMap 
              location={event.location} 
              latitude={event.latitude} 
              longitude={event.longitude} 
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ bgcolor: '#f7fbf9', p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Hosts
              </Typography>
              {displayHosts.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No hosts listed for this event.
                </Typography>
              )}
              {displayHosts.map((host) => (
                <Box
                  key={host.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <Avatar
                    src={host.avatar_url}
                    sx={{ width: 48, height: 48, bgcolor: '#F5F5F5' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {host.full_name || 'Host'}
                    </Typography>
                    {host.role && (
                      <Typography variant="body2" color="text.secondary">
                        {host.role}
                      </Typography>
                    )}
                    {host.email && (
                      <Typography variant="body2" color="text.secondary">
                        {host.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: '#3A7D44',
                  '&:hover': { bgcolor: '#2D5F35' },
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: 2,
                }}
              >
                Contact the Host
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 