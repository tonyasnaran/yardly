'use client';

import { Container, Typography, Paper } from '@mui/material';

export default function ListYourYardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          List Your Yard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create a listing for your yard and start earning money.
        </Typography>
      </Paper>
    </Container>
  );
} 