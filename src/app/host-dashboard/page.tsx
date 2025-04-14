'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { Event, Sync } from '@mui/icons-material';

// Loading component for the dashboard content
function DashboardContent() {
  const searchParams = useSearchParams();
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [todaysStats, setTodaysStats] = useState({
    checkIns: 0,
    checkOuts: 0,
    tripsInProgress: 4,
    pendingReviews: 4,
  });

  useEffect(() => {
    const checkCalendarConnection = async () => {
      try {
        const response = await fetch('/api/auth/google-calendar/status');
        const data = await response.json();
        setIsCalendarConnected(data.isConnected);
      } catch (error) {
        console.error('Error checking calendar connection:', error);
      }
    };

    checkCalendarConnection();
  }, []);

  useEffect(() => {
    // Check URL parameters for calendar connection status
    const calendar = searchParams.get('calendar');
    const error = searchParams.get('error');

    if (calendar === 'connected') {
      setSyncMessage({ type: 'success', text: 'Google Calendar connected successfully!' });
      setIsCalendarConnected(true);
    } else if (error) {
      setSyncMessage({ type: 'error', text: error });
    }
  }, [searchParams]);

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch('/api/auth/google-calendar');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect Google Calendar');
      }
      const data = await response.json();
      if (!data.url) {
        throw new Error('No authentication URL received');
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setSyncMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to connect Google Calendar' 
      });
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSyncMessage({ 
        type: 'success', 
        text: `Successfully synced ${data.addedEvents.length} bookings to Google Calendar` 
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      setSyncMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to sync calendar' 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {/* Calendar Integration Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Google Calendar Integration
          </Typography>
          {isCalendarConnected ? (
            <Button
              variant="outlined"
              startIcon={<Sync />}
              onClick={handleSyncCalendar}
              disabled={isSyncing}
              sx={{
                color: '#3A7D44',
                borderColor: '#3A7D44',
                '&:hover': {
                  borderColor: '#2D5F35',
                  backgroundColor: 'rgba(58, 125, 68, 0.04)',
                },
              }}
            >
              {isSyncing ? 'Syncing...' : 'Sync Bookings to Calendar'}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Event />}
              onClick={() => setShowConnectDialog(true)}
              sx={{
                backgroundColor: '#3A7D44',
                '&:hover': {
                  backgroundColor: '#2D5F35',
                },
              }}
            >
              Connect Google Calendar
            </Button>
          )}
        </Box>
        {isCalendarConnected && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Your Google Calendar is connected. All confirmed bookings will be automatically synced to your calendar.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Today's Stats */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        What's happening today
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Check-ins</Typography>
            <Typography variant="h4">{todaysStats.checkIns}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Check-outs</Typography>
            <Typography variant="h4">{todaysStats.checkOuts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Trips in Progress</Typography>
            <Typography variant="h4">{todaysStats.tripsInProgress}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Pending Reviews</Typography>
            <Typography variant="h4">{todaysStats.pendingReviews}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Calendar Connection Dialog */}
      <Dialog
        open={showConnectDialog}
        onClose={() => setShowConnectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Connect Google Calendar</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Connecting your Google Calendar will:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="• Automatically add confirmed bookings to your calendar"
                secondary="Keep track of your yard rentals alongside your other events"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Include booking details in calendar events"
                secondary="View guest information, yard details, and booking times"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Set up reminders for check-ins and check-outs"
                secondary="Never miss a booking with calendar notifications"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConnectDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConnectCalendar}
            variant="contained"
            sx={{
              backgroundColor: '#3A7D44',
              '&:hover': {
                backgroundColor: '#2D5F35',
              },
            }}
          >
            Connect Calendar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!syncMessage}
        autoHideDuration={6000}
        onClose={() => setSyncMessage(null)}
      >
        <Alert
          onClose={() => setSyncMessage(null)}
          severity={syncMessage?.type || 'info'}
          sx={{ width: '100%' }}
        >
          {syncMessage?.text}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function HostDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#3A7D44' }} />
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your yards, bookings, and calendar all in one place.
        </Typography>
      </Box>

      <Suspense fallback={<CircularProgress sx={{ color: '#3A7D44' }} />}>
        <DashboardContent />
      </Suspense>
    </Container>
  );
} 