import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { id, lat, lng } = await request.json();

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }

    // Update the coordinates
    const { error: updateError } = await supabase
      .from('yards')
      .update({
        lat: lat,
        lng: lng
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating yard:', updateError);
      return NextResponse.json({ error: 'Failed to update yard' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Yard coordinates updated successfully',
      yard: {
        id,
        lat,
        lng
      }
    });
  } catch (error) {
    console.error('Error in update yard coordinates API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 