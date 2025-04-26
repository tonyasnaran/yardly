import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SupabaseEvent } from '@/types/supabase';
import { Event } from '@/data/events';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform Supabase events to match our frontend Event type
    const transformedEvents: Event[] = events.map((event: SupabaseEvent) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image_url,
      hosts: event.hosts.map(host => ({
        name: host.name,
        image: host.image_url
      }))
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error in events API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 