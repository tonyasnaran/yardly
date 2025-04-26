'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import SearchBar from './SearchBar';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const HeroSection = () => {
  const [mapPinData, setMapPinData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadAnimation = async () => {
      try {
        const response = await fetch('/lotties/map pin.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animationData = await response.json();
        setMapPinData(animationData);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadAnimation();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {typeof window !== 'undefined' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/videos/9sec Rooftop Stock Video.mp4" type="video/mp4" />
          <source src="/videos/9sec Rooftop Stock Video WEBM.webm" type="video/webm" />
        </video>
      )}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 3, md: 4 },
          pt: { xs: 4, md: 0 },
        }}
      >
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
                color: '#59C36A',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '0.02em',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Find Your Perfect Outdoor Space
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                color: 'white',
                textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                letterSpacing: '0.01em',
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                lineHeight: 1.4,
              }}
            >
              Discover and book unique outdoor spaces for your next gathering
            </Typography>
          </motion.div>
        </Box>

        {mapPinData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '-40px',
            }}
          >
            <Lottie
              animationData={mapPinData}
              play
              loop
              style={{ width: 200, height: 200 }}
            />
          </motion.div>
        )}

        <Box
          sx={{
            width: '100%',
            zIndex: 10,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                maxWidth: '1000px',
                mx: 'auto',
                p: { xs: 2, md: 3 },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <SearchBar />
              </motion.div>
            </Box>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 