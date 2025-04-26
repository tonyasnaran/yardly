'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Button, Avatar, Chip } from '@mui/material';
import ContactHostModal from '@/components/ContactHostModal';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Image from 'next/image';

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

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 34.0185,
  lng: -118.2855, // USC Marshall School of Business coordinates
};

export default function EventDetailContent({ event }: EventDetailContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(hosts[0]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleContactHost = (host: typeof hosts[0]) => {
    setSelectedHost(host);
    setIsModalOpen(true);
  };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Image Section */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        height: '400px',
        mb: 6,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <Image
          src={event.image_url}
          alt={event.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 3
          }}>
            {event.name}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={formatDate(event.date)}
                sx={{
                  bgcolor: '#F5F5F5',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 500 }}>
              {event.location}
            </Typography>
          </Box>
        </Grid>

        {/* Main Content and Hosts Section */}
        <Grid container item spacing={4}>
          {/* Description and Map */}
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 6 }}>
              {event.description}
            </Typography>

            {/* Map Section */}
            <Box sx={{ height: '400px', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={15}
                  onLoad={onLoad}
                  options={{
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                      }
                    ],
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false
                  }}
                >
                  <Marker
                    position={defaultCenter}
                    icon={{
                      url: '/map-pin.png',
                      scaledSize: new google.maps.Size(40, 40)
                    }}
                  />
                </GoogleMap>
              </LoadScript>
            </Box>
          </Grid>

          {/* Hosts Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              bgcolor: '#FFFFFF',
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #E0E0E0',
              position: 'sticky',
              top: 24
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Hosts
              </Typography>
              
              {hosts.map((host) => (
                <Box
                  key={host.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 48,
                      height: 48,
                      bgcolor: '#F5F5F5'
                    }}
                  />
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
                  mt: 3,
                  bgcolor: '#3A7D44',
                  '&:hover': {
                    bgcolor: '#2D5F35',
                  },
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Contact the Host
              </Button>
            </Box>
          </Grid>
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