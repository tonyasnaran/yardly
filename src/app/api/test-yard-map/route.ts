import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the most recently added yard
    const { data: yard, error } = await supabase
      .from('yards')
      .select('id, name, lat, lng, city')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching yard:', error);
      return NextResponse.json({ error: 'Failed to fetch yard' }, { status: 500 });
    }

    // Also get the yards being passed to YardMap
    const { data: mapYards, error: mapError } = await supabase
      .from('yards')
      .select('id, name, lat, lng, city')
      .order('created_at', { ascending: false });

    if (mapError) {
      console.error('Error fetching map yards:', mapError);
      return NextResponse.json({ error: 'Failed to fetch map yards' }, { status: 500 });
    }

    return NextResponse.json({ 
      latestYard: yard,
      mapYards: mapYards,
      yardCount: mapYards?.length || 0
    });
  } catch (error) {
    console.error('Error in test yard map API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 