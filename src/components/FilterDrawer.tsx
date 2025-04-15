import { Drawer, Box, Typography, List, ListItem, ListItemText, Checkbox, IconButton, Divider } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedAmenities: string[];
  onFilterChange: (filters: { amenities: string[] }) => void;
}

const AMENITIES = [
  'WiFi',
  'Parking',
  'Kitchen',
  'Bathroom',
  'Shower',
  'Grill',
  'Fire Pit',
  'Swimming Pool',
  'Hot Tub',
  'Pet Friendly',
  'Wheelchair Accessible',
  'Outdoor Seating',
  'Indoor Space',
  'Power Outlets',
  'Lighting',
  'Water Access',
  'Restrooms',
  'Trash Service',
  'Security',
  'Storage'
];

export function FilterDrawer({ open, onClose, selectedAmenities, onFilterChange }: FilterDrawerProps) {
  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    onFilterChange({ amenities: newAmenities });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 360 } }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Amenities
        </Typography>
        <List>
          {AMENITIES.map((amenity) => (
            <ListItem
              key={amenity}
              button
              onClick={() => handleAmenityToggle(amenity)}
              sx={{ py: 0.5 }}
            >
              <Checkbox
                edge="start"
                checked={selectedAmenities.includes(amenity)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={amenity} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
} 