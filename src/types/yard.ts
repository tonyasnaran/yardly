export interface Yard {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  amenities: string[];
  city: string;
  rating?: number;
  reviews?: number;
  lat?: number;
  lng?: number;
  guest_limit: 'Up to 10 guests' | 'Up to 15 guests' | 'Up to 20 guests' | 'Up to 25 guests';
} 