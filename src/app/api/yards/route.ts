import { NextRequest, NextResponse } from 'next/server';

// Mock data for initial development
const mockYards = [
  {
    id: 1,
    title: 'Cozy Backyard Garden',
    city: 'New York',
    price: 50,
    guests: 10,
    image: 'https://source.unsplash.com/random/400x300/?garden',
    amenities: ['Grill', 'Fire Pit', 'Pool'],
  },
  {
    id: 2,
    title: 'Spacious Lawn',
    city: 'Los Angeles',
    price: 75,
    guests: 15,
    image: 'https://source.unsplash.com/random/400x300/?lawn',
    amenities: ['Grill', 'Fire Pit', 'Pool', 'Playground'],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const guests = searchParams.get('guests');
  const amenities = searchParams.get('amenities');

  // Filter yards based on search parameters
  let filteredYards = [...mockYards];

  if (city) {
    filteredYards = filteredYards.filter(yard => 
      yard.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  if (guests) {
    filteredYards = filteredYards.filter(yard => 
      yard.guests >= parseInt(guests)
    );
  }

  if (amenities) {
    filteredYards = filteredYards.filter(yard => 
      yard.amenities.some(amenity => 
        amenity.toLowerCase().includes(amenities.toLowerCase())
      )
    );
  }

  return NextResponse.json(filteredYards);
} 