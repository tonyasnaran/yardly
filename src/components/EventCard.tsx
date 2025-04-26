'use client';

import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/events/${event.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative', height: 200 }}>
        <Image
          src={event.image_url}
          alt={event.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDate(event.date)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.location}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleLearnMoreClick}
            sx={{
              bgcolor: '#3A7D44',
              '&:hover': {
                bgcolor: '#2D5F35',
              },
              textTransform: 'none',
              width: '100%'
            }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 