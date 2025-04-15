import { useState } from 'react';

interface FilterState {
  city: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  amenities: string[];
}

export function useFilter() {
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    guests: 0,
    checkIn: '',
    checkOut: '',
    amenities: []
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    filters,
    updateFilters
  };
} 