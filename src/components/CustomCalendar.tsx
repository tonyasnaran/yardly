'use client';

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

const StyledEventWrapper = styled(Box)(({ theme }) => ({
  padding: '4px',
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  guestName: string;
  guestCount: number;
  yardName: string;
}

interface CustomCalendarProps {
  bookings: Booking[];
}

const CustomCalendar = ({ bookings }: CustomCalendarProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const EventComponent = ({ event }: { event: Booking }) => (
    <StyledEventWrapper>
      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
        {event.yardName}
      </Typography>
      <Typography variant="caption" display="block">
        {event.guestName} • {event.guestCount} guests
      </Typography>
    </StyledEventWrapper>
  );

  const handleSelectEvent = (event: Booking) => {
    setSelectedBooking(event);
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Calendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['month', 'week', 'day']}
        components={{
          event: EventComponent
        }}
        onSelectEvent={handleSelectEvent}
        style={{ height: '100%' }}
        eventPropGetter={() => ({
          style: {
            border: 'none',
            background: 'none',
            padding: '2px'
          }
        })}
      />

      <Dialog 
        open={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              Booking Details
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.yardName}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Guest:</strong> {selectedBooking.guestName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Number of Guests:</strong> {selectedBooking.guestCount}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Date:</strong> {moment(selectedBooking.start).format('MMMM D, YYYY')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Time:</strong> {moment(selectedBooking.start).format('h:mm A')} - {moment(selectedBooking.end).format('h:mm A')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Duration:</strong> {moment.duration(moment(selectedBooking.end).diff(selectedBooking.start)).asHours()} hours
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedBooking(null)} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default CustomCalendar; 