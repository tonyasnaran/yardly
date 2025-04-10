import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { operation, yardId } = await request.json();

    switch (operation) {
      case 'insert':
        const { data: insertedYard, error: insertError } = await supabase
          .from('yards')
          .insert({
            name: 'Test Real-time Yard',
            description: 'A test yard for real-time sync',
            price: 85,
            image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            amenities: ['Pool', 'BBQ'],
            city: 'Santa Monica',
            lat: 34.0195,
            lng: -118.4912,
            guest_limit: 'Up to 15 guests'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return NextResponse.json({ message: 'Yard inserted', yard: insertedYard });

      case 'update':
        const { data: updatedYard, error: updateError } = await supabase
          .from('yards')
          .update({
            name: 'Updated Test Yard',
            price: 95
          })
          .eq('id', yardId)
          .select()
          .single();

        if (updateError) throw updateError;
        return NextResponse.json({ message: 'Yard updated', yard: updatedYard });

      case 'delete':
        const { error: deleteError } = await supabase
          .from('yards')
          .delete()
          .eq('id', yardId);

        if (deleteError) throw deleteError;
        return NextResponse.json({ message: 'Yard deleted' });

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in test-realtime API:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
} 