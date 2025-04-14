import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-calendar/callback`
);

// Scopes for Google Calendar API
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Generate a random state parameter
    const state = randomBytes(32).toString('hex');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: state,
    });

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check authentication first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the tokens in Supabase user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        google_calendar_tokens: tokens,
      },
    });

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Google Calendar auth:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to authenticate with Google Calendar' },
      { status: 500 }
    );
  }
} 