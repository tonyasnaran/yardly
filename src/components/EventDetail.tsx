'use client';

import { Box, Container, Typography, Avatar, Stack, Paper, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Event } from '@/data/events';

interface EventDetailProps {
  event: Event;
}

const EventDetail = ({ event }: EventDetailProps) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  mb: 4,
                }}
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: '#1A1A1A',
                }}
              >
                {event.title}
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#3A7D44',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📅 {event.date}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#3A7D44',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  ⏰ {event.time}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#3A7D44',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📍 {event.location}
                </Typography>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: '#1A1A1A',
                  }}
                >
                  About Event
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                  }}
                >
                  {event.description}
                </Typography>
              </Paper>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/')}
                  sx={{
                    backgroundColor: '#3A7D44',
                    '&:hover': {
                      backgroundColor: '#2d5f35',
                    },
                  }}
                >
                  Back to Home
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  position: 'sticky',
                  top: 20,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: '#1A1A1A',
                  }}
                >
                  Event Hosts
                </Typography>
                <Stack spacing={3}>
                  {event.hosts.map((host, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src={host.image}
                        alt={host.name}
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2px solid #3A7D44',
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          color: '#1A1A1A',
                        }}
                      >
                        {host.name}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetail; 