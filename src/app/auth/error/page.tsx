'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Container } from '@mui/material';

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  useEffect(() => {
    // Log the error for debugging
    console.error('Auth error:', error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {error === 'OAuthCallback'
            ? 'There was a problem signing you in with Google. Please try again.'
            : 'An error occurred during authentication. Please try again.'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
} 