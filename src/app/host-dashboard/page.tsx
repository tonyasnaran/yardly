'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  Tab,
  Tabs,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Event, Sync, MoreVert, TrendingUp, TrendingDown, AttachMoney } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { data: session } = useSession();
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    occupancyRate: 0,
  });
  const [todaysStats, setTodaysStats] = useState({
    checkIns: 0,
    checkOuts: 0,
    tripsInProgress: 4,
    pendingReviews: 4,
  });

  // Generate sample performance data
  useEffect(() => {
    const generatePerformanceData = () => {
      const today = new Date();
      const data = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 29 - i);
        return {
          date: format(date, 'MM/dd'),
          bookings: Math.floor(Math.random() * 5),
          revenue: Math.floor(Math.random() * 500),
          occupancyRate: Math.floor(Math.random() * 100),
        };
      });
      setPerformanceData(data);

      // Calculate monthly stats
      const totalBookings = data.reduce((sum, day) => sum + day.bookings, 0);
      const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
      const avgOccupancy = data.reduce((sum, day) => sum + day.occupancyRate, 0) / data.length;

      setMonthlyStats({
        totalBookings,
        totalRevenue,
        averageRating: 4.8,
        occupancyRate: avgOccupancy,
      });
    };

    generatePerformanceData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkCalendarConnection = async () => {
      try {
        // First try NextAuth session
        if (session?.user) {
          const response = await fetch('/api/auth/google-calendar/status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to check calendar status');
          }

          const data = await response.json();
          setIsCalendarConnected(data.isConnected);
          return;
        }

        // Fallback to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        setIsCalendarConnected(!!user.user_metadata?.google_calendar_tokens);
      } catch (error) {
        console.error('Error checking calendar connection:', error);
        setSyncMessage({ 
          type: 'error', 
          text: 'Failed to check calendar connection status. Please try refreshing the page.' 
        });
      }
    };

    // Only check calendar connection if we have a session
    if (session?.user || supabase) {
      checkCalendarConnection();
    }
  }, [session, supabase]);

  useEffect(() => {
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
      // First try NextAuth session
      if (session?.user) {
        const response = await fetch('/api/auth/google-calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to connect Google Calendar');
        }

        const data = await response.json();
        if (!data.url) {
          throw new Error('No authentication URL received');
        }
        window.location.href = data.url;
        return;
      }

      // Fallback to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to connect your calendar');
      }

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
      
      // First try NextAuth session
      if (session?.user) {
        const response = await fetch('/api/calendar/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setSyncMessage({ 
          type: 'success', 
          text: `Successfully synced ${data.addedEvents.length} bookings to Google Calendar` 
        });
        return;
      }

      // Fallback to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to sync your calendar');
      }

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
      {/* Performance Overview Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Monthly Revenue
                </Typography>
                <Typography variant="h4" component="div">
                  ${monthlyStats.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Bookings
                </Typography>
                <Typography variant="h4" component="div">
                  {monthlyStats.totalBookings}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  +8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Rating
                </Typography>
                <Typography variant="h4" component="div">
                  {monthlyStats.averageRating}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Based on 45 reviews
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Occupancy Rate
                </Typography>
                <Typography variant="h4" component="div">
                  {Math.round(monthlyStats.occupancyRate)}%
                </Typography>
                <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ mr: 1 }} />
                  -3% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Performance" />
          <Tab label="Calendar" />
          <Tab label="Reviews" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Revenue & Bookings Trend</Typography>
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3A7D44" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
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
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Reviews</Typography>
          <List>
            {/* Sample reviews - you would fetch these from your backend */}
            {[1, 2, 3].map((review) => (
              <ListItem key={review} divider>
                <ListItemText
                  primary={`Guest Review ${review}`}
                  secondary="Great experience! The yard was perfect for our event."
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

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

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Download Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share Dashboard</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print View</MenuItem>
      </Menu>

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

export const dynamic = 'force-dynamic';

export default function HostDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check NextAuth session first
        if (status === 'authenticated' && session?.user) {
          setUser(session.user);
          setLoading(false);
          return;
        }

        // Fallback to Supabase session
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
        if (error || !supabaseUser) {
          console.error('No authenticated user found');
          router.push('/auth/signin');
          return;
        }

        setUser(supabaseUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase.auth, session, status]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#3A7D44' }} />
      </Container>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back{user.user_metadata?.full_name || user.name ? `, ${user.user_metadata?.full_name || user.name}` : ''}
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