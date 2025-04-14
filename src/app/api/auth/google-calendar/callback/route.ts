import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // If there's an error from Google
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/host-dashboard?error=${encodeURIComponent(error)}`
      );
    }

    // If there's no state parameter, this is a NextAuth callback
    if (!state) {
      // Let NextAuth handle this request
      return new Response(null, { status: 404 });
    }
    
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/host-dashboard?error=No authorization code received`
      );
    }

    // Exchange the code for tokens
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to exchange code for tokens');
    }

    // Redirect back to the host dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/host-dashboard?calendar=connected`
    );
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/host-dashboard?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect calendar'
      )}`
    );
  }
} 