'use client';

import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  location: string;
}

export default function EventCard({ id, title, description, date, image, location }: EventCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/events/${id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={handleClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: 'cover',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={date}
              size="small"
              sx={{
                backgroundColor: '#3A7D44',
                color: 'white',
                fontWeight: 600,
                mb: 1,
              }}
            />
          </Box>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.9rem',
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#3A7D44',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            📍 {location}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
} 