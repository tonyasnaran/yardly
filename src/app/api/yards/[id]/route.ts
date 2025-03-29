import { NextRequest, NextResponse } from 'next/server';

// Mock data for initial development
const mockYards = [
  {
    id: "1",
    title: 'Cozy Backyard Garden',
    city: 'New York',
    price: 50,
    guests: 10,
    image: 'https://source.unsplash.com/random/400x300/?garden',
    amenities: ['Grill', 'Fire Pit', 'Pool'],
    description: 'A peaceful garden space perfect for intimate gatherings and outdoor dining. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space.',
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ['Central Park', 'Times Square', 'Empire State Building']
  },
  {
    id: "2",
    title: 'Spacious Lawn',
    city: 'Los Angeles',
    price: 75,
    guests: 15,
    image: 'https://source.unsplash.com/random/400x300/?lawn',
    amenities: ['Grill', 'Fire Pit', 'Pool', 'Playground'],
    description: 'A stunning outdoor space with panoramic city views. Perfect for pool parties and social events with a full outdoor kitchen and bar setup.',
    rating: 4.9,
    reviews: 36,
    nearbyAttractions: ['Hollywood Sign', 'Griffith Observatory', 'Santa Monica Pier']
  },
];

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Yard ID is required' },
        { status: 400 }
      );
    }

    const yard = mockYards.find(yard => yard.id === id);

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