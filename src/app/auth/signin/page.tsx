'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

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
          Sign In
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{
            bgcolor: '#fff',
            color: '#000',
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    }>
      <SignInContent />
    </Suspense>
  );
} 