import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-calendar/callback`
);

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    // Get the user's Google Calendar tokens
    const tokens = user.user_metadata.google_calendar_tokens;
    if (!tokens) {
      throw new Error('Google Calendar not connected');
    }

    // Set up Google Calendar API
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get all bookings for this host
    const { data: yards, error: yardsError } = await supabase
      .from('yards')
      .select('id, name')
      .eq('user_id', user.id);

    if (yardsError) {
      throw yardsError;
    }

    const yardIds = yards.map(yard => yard.id);
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, yards(*)')
      .in('yard_id', yardIds)
      .eq('status', 'confirmed');

    if (bookingsError) {
      throw bookingsError;
    }

    // Get existing calendar events to avoid duplicates
    const existingEvents = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      q: 'Yardly Booking:', // Search for our custom prefix
    });

    const existingEventIds = new Set(
      existingEvents.data.items?.map(event => event.description?.split('Booking ID: ')[1]) || []
    );

    // Add new bookings to Google Calendar
    const addedEvents = [];
    for (const booking of bookings) {
      // Skip if already in calendar
      if (existingEventIds.has(booking.id)) {
        continue;
      }

      const event = {
        summary: `Yardly Booking: ${booking.yards.name}`,
        description: `Booking ID: ${booking.id}\nGuest: ${booking.guest_name}\nNumber of guests: ${booking.guests}`,
        start: {
          dateTime: booking.check_in,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: booking.check_out,
          timeZone: 'America/Los_Angeles',
        },
        reminders: {
          useDefault: true,
        },
      };

      try {
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
        addedEvents.push(response.data);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${addedEvents.length} events to Google Calendar`,
      addedEvents,
    });
  } catch (error) {
    console.error('Error syncing calendar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync calendar' },
      { status: 500 }
    );
  }
} 