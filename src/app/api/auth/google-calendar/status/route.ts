import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    const isConnected = !!user?.user_metadata?.google_calendar_tokens;

    return NextResponse.json({ isConnected });
  } catch (error) {
    console.error('Error checking calendar connection:', error);
    return NextResponse.json(
      { error: 'Failed to check calendar connection' },
      { status: 500 }
    );
  }
} 