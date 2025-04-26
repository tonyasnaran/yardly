'use client';

import { Box, Typography } from '@mui/material';
import YardMap from './YardMap';

interface MapSectionProps {
  yards: Array<{
    id: string | number;
    name: string;
    price: number;
    image_url: string;
    city?: string;
    lat?: number;
    lng?: number;
  }>;
}

export default function MapSection({ yards }: MapSectionProps) {
  return (
    <Box sx={{ mt: 12, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#3A7D44' }}>
        Explore Yards Near You
      </Typography>
      <YardMap
        yards={yards}
        onMarkerClick={(id) => window.location.href = `/yards/${id}/book`}
      />
    </Box>
  );
} 