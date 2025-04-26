'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Button, Avatar, Chip } from '@mui/material';
import ContactHostModal from '@/components/ContactHostModal';

// Mock hosts data
const hosts = [
  { id: 1, name: 'Sarah Johnson', role: 'Event Organizer' },
  { id: 2, name: 'Michael Chen', role: 'Community Manager' },
];

interface EventDetailContentProps {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    image_url: string;
  };
}

export default function EventDetailContent({ event }: EventDetailContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(hosts[0]);

  const handleContactHost = (host: typeof hosts[0]) => {
    setSelectedHost(host);
    setIsModalOpen(true);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Image Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '400px',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={event.image_url}
          alt={event.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {event.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip
              label={new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              sx={{ bgcolor: '#E8F5E9' }}
            />
            <Chip
              label={event.location}
              sx={{ bgcolor: '#E3F2FD' }}
            />
          </Box>

          <Typography variant="body1" paragraph sx={{ color: '#666', lineHeight: 1.8 }}>
            {event.description}
          </Typography>
        </Grid>

        {/* Hosts Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: '#F8F9FA', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Hosts
            </Typography>
            
            {hosts.map((host) => (
              <Box
                key={host.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 1,
                }}
              >
                <Avatar sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {host.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {host.role}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Button
              variant="contained"
              fullWidth
              onClick={() => handleContactHost(hosts[0])}
              sx={{
                mt: 2,
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
              }}
            >
              Contact the Host
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ContactHostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hostName={selectedHost.name}
      />
    </Container>
  );
} 