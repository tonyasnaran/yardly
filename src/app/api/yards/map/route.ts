import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }

    let query = supabase
      .from('yards')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: yards, error } = await query;

    if (error) {
      console.error('Error fetching yards:', error);
      return NextResponse.json({ error: 'Failed to fetch yards' }, { status: 500 });
    }

    return NextResponse.json(yards);
  } catch (error) {
    console.error('Error in yards API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 