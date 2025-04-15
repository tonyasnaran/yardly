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
import { TrendingUp, TrendingDown, AttachMoney, MoreVert } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import CustomCalendar from '@/components/CustomCalendar';

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { data: session } = useSession();
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
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add mock bookings data
  useEffect(() => {
    const today = new Date();
    const mockBookings = [
      {
        id: '1',
        title: 'Backyard Paradise - John Smith',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
        guestName: 'John Smith',
        guestCount: 4,
        yardName: 'Backyard Paradise'
      },
      {
        id: '2',
        title: 'Urban Oasis - Sarah Johnson',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0),
        guestName: 'Sarah Johnson',
        guestCount: 6,
        yardName: 'Urban Oasis'
      },
      {
        id: '3',
        title: 'Garden Retreat - Mike Brown',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0, 0),
        guestName: 'Mike Brown',
        guestCount: 3,
        yardName: 'Garden Retreat'
      },
      {
        id: '4',
        title: 'Backyard Paradise - Emma Wilson',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 19, 0, 0),
        guestName: 'Emma Wilson',
        guestCount: 8,
        yardName: 'Backyard Paradise'
      },
      {
        id: '5',
        title: 'Urban Oasis - David Lee',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 12, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0, 0),
        guestName: 'David Lee',
        guestCount: 5,
        yardName: 'Urban Oasis'
      },
      {
        id: '6',
        title: 'Garden Retreat - Lisa Chen',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 0, 0),
        guestName: 'Lisa Chen',
        guestCount: 4,
        yardName: 'Garden Retreat'
      },
      {
        id: '7',
        title: 'Backyard Paradise - Tom Harris',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 13, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 17, 0, 0),
        guestName: 'Tom Harris',
        guestCount: 6,
        yardName: 'Backyard Paradise'
      }
    ];

    setBookings(mockBookings);
    setLoading(false);
  }, []);

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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box sx={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
            <CustomCalendar bookings={bookings} />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Reviews</Typography>
          <List>
            <ListItem divider>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      Backyard Paradise
                    </Typography>
                    <Box sx={{ display: 'flex', color: 'warning.main' }}>
                      {'★'.repeat(5)}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      "The space was absolutely perfect for our daughter's sweet sixteen! Sarah was incredibly accommodating with our setup needs, and the string lights created such a magical atmosphere in the evening. The built-in BBQ was a huge plus for our catering. Would definitely book again!"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      - Jennifer Martinez, 3 days ago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      Urban Oasis
                    </Typography>
                    <Box sx={{ display: 'flex', color: 'warning.main' }}>
                      {'★'.repeat(4)}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      "What a fantastic spot for our team building event! The modern seating area and fire pit were perfect for our group discussions. The WiFi was reliable for our hybrid participants. Only minor feedback would be to add more shade options for hot afternoons."
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      - Michael Chen, 1 week ago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      Garden Retreat
                    </Typography>
                    <Box sx={{ display: 'flex', color: 'warning.main' }}>
                      {'★'.repeat(5)}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      "This garden space exceeded all our expectations for our small wedding ceremony! The rose garden provided a stunning backdrop for photos, and the koi pond added such a peaceful ambiance. The hosts even helped us arrange the chairs perfectly for the ceremony. It was truly a magical day!"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      - Emily & David Thompson, 2 weeks ago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </TabPanel>

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
    </>
  );
}

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