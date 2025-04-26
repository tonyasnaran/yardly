import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import EventDetailContent from '@/components/EventDetailContent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getEvent(id: string) {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    return null;
  }

  return event;
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return <EventDetailContent event={event} />;
} 