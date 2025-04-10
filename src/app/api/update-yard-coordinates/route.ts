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

    // First, check if the yard exists
    const { data: yard, error: fetchError } = await supabase
      .from('yards')
      .select('id, name, lat, lng')
      .eq('name', 'Luxury Backyard Oasis')
      .single();

    if (fetchError) {
      console.error('Error fetching yard:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch yard' }, { status: 500 });
    }

    if (!yard) {
      return NextResponse.json({ error: 'Yard not found' }, { status: 404 });
    }

    // Update the coordinates
    const { error: updateError } = await supabase
      .from('yards')
      .update({
        lat: 34.0736,
        lng: -118.4004
      })
      .eq('id', yard.id);

    if (updateError) {
      console.error('Error updating yard:', updateError);
      return NextResponse.json({ error: 'Failed to update yard' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Yard coordinates updated successfully',
      yard: {
        ...yard,
        lat: 34.0736,
        lng: -118.4004
      }
    });
  } catch (error) {
    console.error('Error in update yard coordinates API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 