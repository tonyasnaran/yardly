import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Rating
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface YardCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  city: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  guest_limit: string;
}

export default function YardCard({
  id,
  title,
  description,
  price,
  image,
  amenities = [],
  city,
  isFavorite = false,
  onFavoriteToggle,
  guest_limit
}: YardCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking the favorite button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/yards/${id}/book`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 3
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {onFavoriteToggle && (
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
              zIndex: 3,
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: '#3A7D44' }} />
            ) : (
              <FavoriteBorder sx={{ color: '#3A7D44' }} />
            )}
          </IconButton>
        )}
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="h2"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 500,
                mb: 1,
                height: '2.4em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={guest_limit}
                size="small"
                sx={{ 
                  bgcolor: '#FFD166', 
                  color: '#3A7D44',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
              {amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  size="small"
                  sx={{ 
                    bgcolor: '#F5E6D3',
                    color: '#3A7D44',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 'auto' }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              {city}
            </Typography>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                mb: 2,
                fontSize: '1.25rem',
                fontWeight: 500
              }}
            >
              ${price}/hour
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/yards/${id}/book`);
              }}
              sx={{
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
} 