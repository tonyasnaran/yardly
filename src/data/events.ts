export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  host_name?: string;
  created_at: string;
  updated_at: string;
}

export const events: Event[] = [
  {
    id: '1',
    name: 'Community Garden Workshop',
    description: 'Join us for a hands-on workshop where we\'ll learn about sustainable gardening practices, composting, and urban farming techniques. Perfect for beginners and experienced gardeners alike!',
    date: '2024-05-15T10:00:00',
    location: 'Central Park Community Garden',
    image_url: '/images/events/garden-workshop.jpg',
    host_name: 'Green Thumb Collective',
    created_at: '2024-04-01T00:00:00',
    updated_at: '2024-04-01T00:00:00'
  },
  {
    id: '2',
    name: 'Yard Sale Extravaganza',
    description: 'The biggest yard sale of the season! Find unique treasures, vintage items, and great deals. Food trucks and live music will be on site.',
    date: '2024-06-01T09:00:00',
    location: 'Downtown Market Square',
    image_url: '/images/events/yard-sale.jpg',
    host_name: 'Downtown Business Association',
    created_at: '2024-04-01T00:00:00',
    updated_at: '2024-04-01T00:00:00'
  },
  {
    id: '3',
    name: 'Outdoor Movie Night',
    description: 'Bring your blankets and chairs for a family-friendly movie night under the stars. We\'ll be showing a classic family film on our giant outdoor screen.',
    date: '2024-07-15T20:00:00',
    location: 'Riverside Park',
    image_url: '/images/events/movie-night.jpg',
    host_name: 'Parks and Recreation Department',
    created_at: '2024-04-01T00:00:00',
    updated_at: '2024-04-01T00:00:00'
  }
]; 