import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Beachfront Garden Oasis",
    price: 90,
    image: "/images/yards/Beachfront Garden Oasis.jpg",
  },
  {
    id: 2,
    title: "Bohemian Backyard",
    price: 75,
    image: "/images/yards/Bohemian Backyard.jpg",
  },
  {
    id: 3,
    title: "Los Angeles Downtown Rooftop",
    price: 65,
    image: "/images/yards/Los Angeles Downtown Rooftop.png",
  },
  {
    id: 4,
    title: "Ocean View Patio",
    price: 85,
    image: "/images/yards/Ocean View Patio.jpg",
  },
  {
    id: 5,
    title: "Santa Monica Garden",
    price: 55,
    image: "/images/yards/Santa Monica Garden.jpg",
  },
  {
    id: 6,
    title: "Urban Rooftop Garden",
    price: 60,
    image: "/images/yards/Urban Rooftop Garden.jpg",
  }
];

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Fetching yard with ID:', id);

    const { data, error } = await supabase
      .from('yards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch yard details' },
        { status: 500 }
      );
    }

    if (!data) {
      console.log('No yard found with ID:', id);
      return NextResponse.json(
        { error: 'Yard not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image_url: data.image_url,
      amenities: data.amenities || [],
      city: data.city,
      guest_limit: data.guest_limit,
      lat: data.lat,
      lng: data.lng
    };

    console.log('Returning yard data:', transformedData);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching yard details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yard details' },
      { status: 500 }
    );
  }
} 