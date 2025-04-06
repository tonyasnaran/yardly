'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  Divider,
  Paper,
  Radio,
  RadioGroup,
} from '@mui/material';

const AMENITY_OPTIONS = [
  'Pool',
  'Hot Tub',
  'Outdoor Kitchen',
  'Fire Pit',
  'Grill',
  'Playground',
  'Restroom Access',
  'Speakers/Sound System',
  'Kid Friendly',
  'Covered Patio',
  'Wi-Fi'
];

interface FilterPanelProps {
  onApplyFilters: (filters: {
    amenities: string[];
    priceRange: string;
  }) => void;
}

export default function FilterPanel({ onApplyFilters }: FilterPanelProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
    handleApplyFilters();
  };

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriceRange(event.target.value);
    handleApplyFilters();
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      amenities: selectedAmenities,
      priceRange: selectedPriceRange,
    });
  };

  const handleClearAll = () => {
    setSelectedAmenities([]);
    setSelectedPriceRange('all');
    onApplyFilters({
      amenities: [],
      priceRange: 'all',
    });
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        bgcolor: 'transparent',
        border: 'none',
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {(selectedAmenities.length > 0 || selectedPriceRange !== 'all') && (
          <Button
            onClick={handleClearAll}
            sx={{
              color: '#3A7D44',
              '&:hover': {
                bgcolor: 'rgba(58, 125, 68, 0.1)',
              },
            }}
          >
            Clear all
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Price Range
      </Typography>
      <RadioGroup
        value={selectedPriceRange}
        onChange={handlePriceRangeChange}
        sx={{ mb: 4 }}
      >
        <FormControlLabel
          value="all"
          control={<Radio sx={{ '&.Mui-checked': { color: '#3A7D44' } }} />}
          label="All"
        />
        <FormControlLabel
          value="under-100"
          control={<Radio sx={{ '&.Mui-checked': { color: '#3A7D44' } }} />}
          label="Under $100"
        />
        <FormControlLabel
          value="100-200"
          control={<Radio sx={{ '&.Mui-checked': { color: '#3A7D44' } }} />}
          label="$100 to $200"
        />
        <FormControlLabel
          value="200-plus"
          control={<Radio sx={{ '&.Mui-checked': { color: '#3A7D44' } }} />}
          label="$200 & Above"
        />
      </RadioGroup>

      <Divider sx={{ mb: 3 }} />

      {/* Amenities Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Amenities
      </Typography>
      <FormGroup>
        {AMENITY_OPTIONS.map((amenity) => (
          <FormControlLabel
            key={amenity}
            control={
              <Checkbox
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                sx={{
                  '&.Mui-checked': {
                    color: '#3A7D44',
                  },
                }}
              />
            }
            label={amenity}
          />
        ))}
      </FormGroup>
    </Paper>
  );
} 