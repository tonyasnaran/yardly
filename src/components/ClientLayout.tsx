'use client';

import { Box, Container } from '@mui/material';
import AuthButton from './AuthButton';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          component="a"
          href="/"
          sx={{
            typography: 'h6',
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          Yardly
        </Box>
        <AuthButton />
      </Box>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            © {new Date().getFullYear()} Yardly. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 