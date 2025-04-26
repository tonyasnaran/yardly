'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function ContactHostButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleSend = () => {
    setOpen(false);
    setMessage('');
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          bgcolor: '#3A7D44',
          '&:hover': { bgcolor: '#2D5F35' },
          py: 1.5,
          textTransform: 'none',
          fontSize: '1rem',
          borderRadius: 2,
        }}
        onClick={handleOpen}
      >
        Contact the Host
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Contact the Host</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            Have a question about the event? You can send a message to the host.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Message"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={message}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSend} variant="contained" sx={{ bgcolor: '#3A7D44', '&:hover': { bgcolor: '#2D5F35' } }}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 