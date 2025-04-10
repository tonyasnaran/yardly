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

    const { data: yard, error } = await supabase
      .from('yards')
      .select('id, name, lat, lng')
      .eq('name', 'Luxury Backyard Oasis')
      .single();

    if (error) {
      console.error('Error fetching yard:', error);
      return NextResponse.json({ error: 'Failed to fetch yard' }, { status: 500 });
    }

    return NextResponse.json(yard);
  } catch (error) {
    console.error('Error in test yard API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 