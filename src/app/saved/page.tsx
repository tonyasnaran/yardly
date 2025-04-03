'use client';

import { Container, Typography, Paper } from '@mui/material';

export default function SavedPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Saved Yards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your saved yards will appear here.
        </Typography>
      </Paper>
    </Container>
  );
} 