'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo, useEffect, useState } from 'react';

interface EventMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
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
};

export default function EventMap({ location, latitude, longitude }: EventMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude && Math.abs(latitude) > 0 && Math.abs(longitude) > 0
      ? { lat: latitude, lng: longitude }
      : null
  );
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Geocode if no valid lat/lng
  useEffect(() => {
    if (!center && isLoaded && location) {
      setGeoLoading(true);
      setGeoError(null);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setCenter({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          setGeoError('Could not find location');
        }
        setGeoLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, latitude, longitude]);

  const markerIcon = useMemo(() => ({
    url: '/map-pin.png',
    scaledSize: isLoaded && window.google?.maps ? new window.google.maps.Size(40, 40) : null,
  }), [isLoaded]);

  if (loadError) {
    return (
      <Box 
        sx={{ 
          height: 400, 
          width: '100%', 
          borderRadius: 2, 
          bgcolor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <p>Error loading map</p>
      </Box>
    );
  }

  if (!isLoaded || geoLoading || !center) {
    return (
      <Box 
        sx={{ 
          height: 400, 
          width: '100%', 
          borderRadius: 2, 
          bgcolor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (geoError) {
    return (
      <Box sx={{ height: 400, width: '100%', borderRadius: 2, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Typography color="error">{geoError}</Typography>
      </Box>
    );
  }

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#3A7D44', fontWeight: 600 }}>
        Location: {location}
      </Typography>
      <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={mapOptions}
        >
          <Marker
            position={center}
            icon={markerIcon}
          />
        </GoogleMap>
      </Box>
    </Box>
  );
} 