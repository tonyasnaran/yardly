'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';

const steps = ['Personal Information', 'Yard Details', 'Pricing & Availability'];

interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  address: string;
  
  // Yard Details
  yardSize: string;
  eventTypes: string;
  description: string;
  amenities: string[];
  
  // Pricing & Availability
  pricePerHour: string;
  availability: string;
}

export default function ListYourYardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    yardSize: '',
    eventTypes: '',
    description: '',
    amenities: [],
    pricePerHour: '',
    availability: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    setSubmitStatus('loading');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setSubmitMessage('Your yard has been submitted successfully! We will review it shortly.');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit your yard. Please try again.');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange('fullName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleChange('address')}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Yard Size (square feet)"
                type="number"
                value={formData.yardSize}
                onChange={handleChange('yardSize')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Types of Events"
                value={formData.eventTypes}
                onChange={handleChange('eventTypes')}
                placeholder="e.g., Birthday parties, weddings, corporate events"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Describe your yard, its features, and what makes it special"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      amenities: event.target.value as string[],
                    });
                  }}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  <MenuItem value="grill">Grill</MenuItem>
                  <MenuItem value="pool">Pool</MenuItem>
                  <MenuItem value="firepit">Fire Pit</MenuItem>
                  <MenuItem value="playground">Playground</MenuItem>
                  <MenuItem value="hottub">Hot Tub</MenuItem>
                  <MenuItem value="outdoor_kitchen">Outdoor Kitchen</MenuItem>
                </Select>
                <FormHelperText>Select all that apply</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price per Hour ($)"
                type="number"
                value={formData.pricePerHour}
                onChange={handleChange('pricePerHour')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Availability"
                value={formData.availability}
                onChange={handleChange('availability')}
                placeholder="e.g., Weekends, Evenings, 24/7"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          color: '#3A7D44',
          fontWeight: 'bold',
        }}
      >
        List Your Yard
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {submitStatus === 'success' ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            {submitMessage}
          </Alert>
        ) : submitStatus === 'error' ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitMessage}
          </Alert>
        ) : (
          <>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={submitStatus === 'loading'}
                sx={{
                  bgcolor: '#3A7D44',
                  '&:hover': {
                    bgcolor: '#2D5F35',
                  },
                }}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
} 