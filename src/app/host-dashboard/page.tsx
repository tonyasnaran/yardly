'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Star,
  TrendingUp,
  Info,
  Event,
  Sync,
} from '@mui/icons-material';
import { supabase } from '@/lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const performanceData = [
  { name: '05/27', yourListings: 20, similarListings: 25 },
  { name: '06/03', yourListings: 30, similarListings: 45 },
  { name: '06/10', yourListings: 25, similarListings: 55 },
  { name: '06/17', yourListings: 35, similarListings: 50 },
  { name: '06/24', yourListings: 45, similarListings: 48 },
];

export default function HostDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [todaysStats, setTodaysStats] = useState({
    checkIns: 0,
    checkOuts: 0,
    tripsInProgress: 4,
    pendingReviews: 4,
  });
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const checkCalendarConnection = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        setIsCalendarConnected(!!user?.user_metadata?.google_calendar_tokens);
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
    } else if (error) {
      setSyncMessage({ type: 'error', text: error });
    }
  }, [searchParams]);

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch('/api/auth/google-calendar');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setSyncMessage({ type: 'error', text: 'Failed to connect Google Calendar' });
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
    <Box sx={{ bgcolor: '#F7F7F7', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 1 }}>
            Good afternoon, {session?.user?.name?.split(' ')[0] || 'Host'}!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Booked earnings for August
            </Typography>
            <Typography variant="body2" color="text.secondary">
              30-day bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              30-day views
            </Typography>
          </Box>
        </Box>

        {/* Calendar Section - Add this before Today's Stats */}
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
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{todaysStats.checkIns}</Typography>
              <Typography variant="body2" color="text.secondary">Check-ins</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{todaysStats.checkOuts}</Typography>
              <Typography variant="body2" color="text.secondary">Check-outs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{todaysStats.tripsInProgress}</Typography>
              <Typography variant="body2" color="text.secondary">Trips in progress</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{todaysStats.pendingReviews}+</Typography>
              <Typography variant="body2" color="text.secondary">Pending reviews</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Performance Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Performance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Last 30 days
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h4">64.0%</Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupancy rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h4">100.0%</Typography>
                <Typography variant="body2" color="text.secondary">
                  5-star ratings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h4">75.0%</Typography>
                <Typography variant="body2" color="text.secondary">
                  Booking conversion rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Paper sx={{ p: 3, height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis dataKey="name" stroke="#717171" />
                <YAxis stroke="#717171" />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="yourListings" 
                  stroke="#222222" 
                  name="Your listings"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="similarListings" 
                  stroke="#717171" 
                  strokeDasharray="4 4"
                  name="Similar listings"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="text" 
              sx={{ 
                color: '#222222',
                textDecoration: 'underline',
                textTransform: 'none'
              }}
            >
              Go to performance
            </Button>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 2, bgcolor: '#222222' }} />
                <Typography variant="body2">Your listings</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 2, bgcolor: '#717171', borderStyle: 'dashed' }} />
                <Typography variant="body2">Similar listings</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Booking Requests Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Booking requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              67% response rate
            </Typography>
          </Box>
          <Paper>
            <List>
              <ListItem sx={{ display: 'block', py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Inquiry from Guest</Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      color: '#008489',
                      borderColor: '#008489',
                      textTransform: 'none'
                    }}
                  >
                    Respond
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  1 guest · Sep 14 - Sep 15
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Room near city centre
                </Typography>
              </ListItem>
              <Divider />
              <ListItem sx={{ display: 'block', py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Inquiry from Guest</Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      color: '#008489',
                      borderColor: '#008489',
                      textTransform: 'none'
                    }}
                  >
                    Respond
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  2 guests · Sep 23 - Oct 31
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Room near city centre
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Get More Bookings Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            3 ways to get more bookings
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Let guests book instantly</Typography>
              <Button 
                endIcon={<TrendingUp />}
                sx={{ 
                  color: '#222222',
                  textTransform: 'none'
                }}
              >
                Learn more
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Take advantage of last-minute reservations by making it easier for guests to book your yard
            </Typography>
          </Paper>
        </Box>

        {/* Connect Calendar Dialog */}
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSyncMessage(null)}
            severity={syncMessage?.type || 'info'}
            sx={{ width: '100%' }}
          >
            {syncMessage?.text}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 