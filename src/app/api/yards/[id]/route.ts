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
  },
  {
    id: "2",
    title: 'Spacious Lawn',
    city: 'Los Angeles',
    price: 75,
    guests: 15,
    image: 'https://source.unsplash.com/random/400x300/?lawn',
    amenities: ['Grill', 'Fire Pit', 'Pool', 'Playground'],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const yard = mockYards.find(yard => yard.id === params.id);

    if (!yard) {
      return NextResponse.json({ error: 'Yard not found' }, { status: 404 });
    }

    return NextResponse.json(yard);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 