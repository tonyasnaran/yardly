'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import YardCard from '@/components/YardCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface YardData {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  amenities?: string[];
  city?: string;
  rating?: number;
  reviews?: number;
  lat: number;
  lng: number;
  guest_limit: string;
  created_at: string;
}

function YardsContent() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [yards, setYards] = useState<YardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYards = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get search parameters
        const city = searchParams.get('city');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        // Build the query
        let query = supabase
          .from('yards')
          .select('*');

        // Add filters based on search parameters
        if (city) {
          query = query.ilike('city', `%${city}%`);
        }

        if (guests) {
          const guestNumber = parseInt(guests);
          query = query.gte('guest_limit', guestNumber);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setYards(data || []);
      } catch (error) {
        console.error('Error fetching yards:', error);
        setError('Failed to fetch yards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchYards();
  }, [searchParams, supabase]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Search Bar Section */}
      <Box
        sx={{
          bgcolor: '#3A7D44',
          py: 4,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <SearchBar />
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : yards.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            No yards found matching your search criteria.
          </Typography>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                color: '#3A7D44',
                fontWeight: 600,
              }}
            >
              Search Results
            </Typography>
            <Grid container spacing={4}>
              {yards.map((yard) => (
                <Grid item xs={12} sm={6} md={4} key={yard.id}>
                  <YardCard
                    id={yard.id.toString()}
                    title={yard.name}
                    description={yard.description}
                    price={yard.price}
                    image={yard.image_url}
                    amenities={yard.amenities || []}
                    city={yard.city || ''}
                    guest_limit={yard.guest_limit}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default function YardsPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <YardsContent />
    </Suspense>
  );
} 