'use client';

import React, { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const steps = ['Personal Information', 'Yard Details', 'Pricing & Availability'];

export default function ListYourYard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    
    // Yard Details
    yardSize: '',
    eventTypes: '',
    description: '',
    amenities: [] as string[],
    
    // Pricing & Availability
    pricePerHour: '',
    availability: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNext = () => {
    // Validate current step
    const currentErrors = validateStep(activeStep);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validateStep = (step: number): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      case 1:
        if (!formData.yardSize) newErrors.yardSize = 'Yard size is required';
        if (!formData.eventTypes) newErrors.eventTypes = 'Event types are required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
      case 2:
        if (!formData.pricePerHour) newErrors.pricePerHour = 'Price per hour is required';
        if (!formData.availability) newErrors.availability = 'Availability is required';
        break;
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setSubmitStatus('loading');
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitStatus('success');
      // Redirect to success page or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
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
                error={!!errors.fullName}
                helperText={errors.fullName}
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
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleChange('address')}
                error={!!errors.address}
                helperText={errors.address}
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
                error={!!errors.yardSize}
                helperText={errors.yardSize}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Types of Events"
                value={formData.eventTypes}
                onChange={handleChange('eventTypes')}
                error={!!errors.eventTypes}
                helperText={errors.eventTypes}
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
                error={!!errors.description}
                helperText={errors.description}
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
                error={!!errors.pricePerHour}
                helperText={errors.pricePerHour}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Availability"
                value={formData.availability}
                onChange={handleChange('availability')}
                error={!!errors.availability}
                helperText={errors.availability}
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
            Your yard has been submitted for review! We'll contact you soon.
          </Alert>
        ) : submitStatus === 'error' ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            There was an error submitting your yard. Please try again.
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