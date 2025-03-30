import { Card, CardContent, Typography, Button, Box, Chip, Stack } from '@mui/material';
import { Yard } from '../types/yard';
import { useState } from 'react';

interface YardCardProps {
  yard: Yard;
  onBook: (yard: Yard) => void;
}

export default function YardCard({ yard, onBook }: YardCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Construct the image path with proper encoding
  const imagePath = `/images/yards/${encodeURIComponent(yard.title)}.${yard.title === "Los Angeles Downtown Rooftop" ? "png" : "jpg"}`;

  // Log the image path for debugging
  console.log('Attempting to load image:', imagePath);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <Box 
        component="div"
        sx={{ 
          position: 'relative', 
          paddingTop: '75%', 
          bgcolor: '#f5f5f5',
          overflow: 'hidden'
        }}
      >
        <img
          src={imagePath}
          alt={yard.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            console.error('Image failed to load:', imagePath);
            setImageError(true);
            // Prevent infinite error loop
            e.currentTarget.onerror = null;
          }}
          loading="eager"
        />
        {imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f5f5f5',
            }}
          >
            <Typography color="text.secondary">
              Image not available
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {yard.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {yard.city}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          ${yard.price}/hour
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {yard.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={`${yard.guests} guests`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          {yard.amenities.map((amenity) => (
            <Chip 
              key={amenity} 
              label={amenity} 
              size="small" 
              variant="outlined"
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {yard.rating} ★
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({yard.reviews} reviews)
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={() => onBook(yard)}
          sx={{ 
            backgroundColor: '#3A7D44',
            '&:hover': {
              backgroundColor: '#2D5F35'
            }
          }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
} 