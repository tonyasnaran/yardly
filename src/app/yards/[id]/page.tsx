'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';

interface Yard {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function YardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [yard, setYard] = useState<Yard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYardDetails = async () => {
      try {
        const response = await fetch(`/api/yard/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch yard details');
        }
        const data = await response.json();
        setYard(data);
      } catch (error) {
        console.error('Error fetching yard details:', error);
        setError('Failed to load yard details');
      } finally {
        setLoading(false);
      }
    };

    fetchYardDetails();
  }, [params.id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading yard details...</Typography>
      </Container>
    );
  }

  if (error || !yard) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error || 'Yard not found'}</Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
            <Image
              src={yard.image}
              alt={yard.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {yard.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${yard.price} per hour
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => router.push(`/yards/${yard.id}/book`)}
              sx={{
                mt: 3,
                bgcolor: '#3A7D44',
                '&:hover': {
                  bgcolor: '#2D5F35',
                },
              }}
            >
              Book Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 