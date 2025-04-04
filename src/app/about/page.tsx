'use client';

import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              mb: 3,
              color: '#3A7D44',
            }}
          >
            About Yardly
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Transforming ordinary yards into extraordinary event spaces
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* What is Yardly */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ mb: 3, color: '#3A7D44' }}>
                What is Yardly?
              </Typography>
              <Typography paragraph>
                Yardly is a revolutionary platform that connects event hosts with unique outdoor spaces. 
                We enable homeowners to share their beautiful yards for personal celebrations, corporate 
                gatherings, and organizational events.
              </Typography>
              <Typography paragraph>
                Unlike traditional venues, Yardly offers a more personal and flexible approach to event 
                hosting. Our hosts are active participants in creating memorable experiences, often 
                providing local insights and connections to trusted catering and party services.
              </Typography>
            </Paper>
          </Grid>

          {/* Why Choose Yardly */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ mb: 3, color: '#3A7D44' }}>
                Why Choose Yardly?
              </Typography>
              <Typography paragraph>
                Say goodbye to overpriced banquet halls and outdated hotel conference rooms. Yardly 
                offers beautiful, unique spaces at a fraction of the cost, with the added benefit of 
                personalized service and local expertise.
              </Typography>
              <Typography paragraph>
                Our flexible hourly rental system means you only pay for the time you need, and our 
                transparent pricing is based on guest capacity and location, making it easy to find 
                the perfect space for your budget.
              </Typography>
            </Paper>
          </Grid>

          {/* How It Works */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ mb: 3, color: '#3A7D44' }}>
                How It Works
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#3A7D44' }}>
                    1. Find Your Space
                  </Typography>
                  <Typography>
                    Browse through our curated selection of yards, filtering by location, size, and 
                    amenities to find your perfect event space.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#3A7D44' }}>
                    2. Book with Confidence
                  </Typography>
                  <Typography>
                    Our secure booking system and 24/7 customer support ensure a smooth process from 
                    reservation to event day.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#3A7D44' }}>
                    3. Create Memories
                  </Typography>
                  <Typography>
                    Host your event in a unique, welcoming space with the support of our experienced 
                    hosts and team.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Trust & Convenience */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: '#f8f9fa',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ mb: 3, color: '#3A7D44' }}>
                Trust & Convenience
              </Typography>
              <Typography paragraph>
                At Yardly, we understand that hosting an event should be exciting, not stressful. 
                That's why we offer 24/7 customer support and a streamlined booking process. Whether 
                you're planning a small family gathering or a large corporate event, our platform 
                makes it easy to find and book the perfect space with confidence.
              </Typography>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/')}
                  sx={{
                    bgcolor: '#3A7D44',
                    '&:hover': {
                      bgcolor: '#2D5F35',
                    },
                    px: 6,
                    py: 2,
                  }}
                >
                  Find Your Perfect Yard
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 