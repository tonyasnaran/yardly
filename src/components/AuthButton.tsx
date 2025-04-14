'use client';

import { useState } from 'react';
import { Button, Menu, MenuItem, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ color: '#3A7D44' }} />
      </Box>
    );
  }

  if (!session) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignIn}
        sx={{
          backgroundColor: '#3A7D44',
          '&:hover': {
            backgroundColor: '#2D5F35'
          }
        }}
      >
        Log in / Sign up
      </Button>
    );
  }

  return (
    <Box>
      <Button
        onClick={handleMenuClick}
        sx={{
          color: '#3A7D44',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(58, 125, 68, 0.04)'
          }
        }}
      >
        Welcome, {session.user?.name?.split(' ')[0] || 'User'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('/profile')}>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/saved')}>
          Saved
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/list-your-yard')}>
          List Your Yard
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/host-dashboard')}>
          Host Dashboard
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
} 