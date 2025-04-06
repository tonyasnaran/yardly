import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get map bounds
    const north = parseFloat(searchParams.get('north') || '0');
    const south = parseFloat(searchParams.get('south') || '0');
    const east = parseFloat(searchParams.get('east') || '0');
    const west = parseFloat(searchParams.get('west') || '0');
    
    // Get filter parameters
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');
    const guestLimit = parseInt(searchParams.get('guestLimit') || '0');
    const amenities = searchParams.get('amenities')?.split(',') || [];
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('yards')
      .select(`
        *,
        amenities (
          id,
          name
        ),
        bookings (
          start_time,
          end_time
        )
      `)
      .gte('latitude', south)
      .lte('latitude', north)
      .gte('longitude', west)
      .lte('longitude', east)
      .gte('price_per_hour', minPrice)
      .lte('price_per_hour', maxPrice);

    if (guestLimit > 0) {
      query = query.gte('guest_limit', guestLimit);
    }

    if (amenities.length > 0) {
      query = query.contains('amenity_ids', amenities);
    }

    // Filter out yards that are booked during the selected time period
    if (startDate && endDate) {
      query = query.not('bookings', 'cs', `[{"start_time":"${startDate}","end_time":"${endDate}"}]`);
    }

    const { data: yards, error } = await query;

    if (error) {
      console.error('Error fetching yards:', error);
      return NextResponse.json({ error: 'Failed to fetch yards' }, { status: 500 });
    }

    return NextResponse.json({ yards });
  } catch (error) {
    console.error('Error in map yards route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 