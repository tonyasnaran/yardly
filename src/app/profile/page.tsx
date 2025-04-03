'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  bio: string;
  phone: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    picture: '',
    bio: '',
    phone: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        picture: session.user.image || '',
        bio: '',
        phone: '',
      });
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          picture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log('Updated profile:', profile);
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#3A7D44' }} />
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={profile.picture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture"
              type="file"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture">
              <IconButton
                color="primary"
                component="span"
                sx={{ backgroundColor: '#3A7D44', '&:hover': { backgroundColor: '#2D5F35' } }}
              >
                <PhotoCamera sx={{ color: 'white' }} />
              </IconButton>
            </label>
          </Box>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            margin="normal"
            type="tel"
          />

          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: '#3A7D44',
              '&:hover': {
                backgroundColor: '#2D5F35'
              }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 