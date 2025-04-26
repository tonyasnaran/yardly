'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';

interface ContactHostModalProps {
  open: boolean;
  onClose: () => void;
  hostName: string;
}

export default function ContactHostModal({ open, onClose, hostName }: ContactHostModalProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // For now, just close the modal
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
          Contact the Host
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Have a question about the event? You can send a message to {hostName}.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#3A7D44',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3A7D44',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            bgcolor: '#3A7D44',
            '&:hover': {
              bgcolor: '#2D5F35',
            },
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
} 