export interface SupabaseEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
  hosts: {
    name: string;
    image_url: string;
  }[];
  created_at: string;
  updated_at: string;
} 