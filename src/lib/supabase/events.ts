import { createClient } from '@/lib/supabase/client';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
}

export interface EventHost {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  // Fallback fields if no join
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export async function getEventById(id: string): Promise<{ event: Event; hosts: EventHost[] } | null> {
  const supabase = createClient();

  // Fetch the event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (eventError || !event) {
    console.error('Error fetching event:', eventError);
    return null;
  }

  // Try to fetch hosts with join, fallback to basic host info if join fails
  let hosts: EventHost[] = [];
  let hostsError = null;
  try {
    const { data: joinedHosts, error: joinError } = await supabase
      .from('event_hosts')
      .select('*')
      .eq('event_id', id);
    if (joinError) {
      hostsError = joinError;
    } else {
      hosts = joinedHosts || [];
    }
  } catch (e) {
    hostsError = e;
  }

  if (hostsError) {
    console.error('Error fetching event hosts:', hostsError);
    // fallback: return empty array
    hosts = [];
  }

  return {
    event,
    hosts,
  };
} 