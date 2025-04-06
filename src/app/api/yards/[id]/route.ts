import { NextResponse } from 'next/server';

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
    city: "Downtown",
    price: 65,
    guests: 20,
    image: "/images/yards/Los Angeles Downtown Rooftop.png",
    amenities: ["Outdoor Kitchen", "Fire Pit", "Playground"],
    description: "A modern rooftop space with panoramic views of the LA skyline. Features a fully equipped outdoor kitchen, cozy fire pit, and a small playground area for kids. Perfect for corporate events and family gatherings with stunning city views.",
    rating: 4.7,
    reviews: 18,
    nearbyAttractions: ["Staples Center", "Grand Park", "The Broad Museum"]
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
    const yard = yards.find(y => y.id === parseInt(params.id));
    
    if (!yard) {
      return NextResponse.json(
        { error: 'Yard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(yard);
  } catch (error) {
    console.error('Error fetching yard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 