import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Cozy Backyard Garden",
    city: "New York",
    price: 50,
    guests: 10,
    image: "https://source.unsplash.com/random/400x300/?garden",
    amenities: ["Grill", "Fire Pit", "Pool"],
    description: "A peaceful garden space perfect for intimate gatherings and outdoor dining. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space.",
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ["Central Park", "Times Square", "Empire State Building"]
  },
  {
    id: 2,
    title: "Luxury Poolside Retreat",
    city: "Los Angeles",
    price: 75,
    guests: 15,
    image: "https://source.unsplash.com/random/400x300/?pool",
    amenities: ["Pool", "Hot Tub", "Outdoor Kitchen"],
    description: "A stunning outdoor space featuring a large pool, hot tub, and fully equipped outdoor kitchen. Perfect for summer gatherings and pool parties.",
    rating: 4.9,
    reviews: 31,
    nearbyAttractions: ["Hollywood Sign", "Griffith Observatory", "Santa Monica Pier"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const guests = searchParams.get('guests');
    const amenities = searchParams.get('amenities');

    // Filter yards based on search parameters
    let filteredYards = [...yards];

    if (city) {
      filteredYards = filteredYards.filter(yard => 
        yard.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (guests) {
      const guestCount = parseInt(guests);
      if (!isNaN(guestCount)) {
        filteredYards = filteredYards.filter(yard => 
          yard.guests >= guestCount
        );
      }
    }

    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim().toLowerCase());
      filteredYards = filteredYards.filter(yard => 
        yard.amenities.some(amenity => 
          amenityList.includes(amenity.toLowerCase())
        )
      );
    }

    return NextResponse.json({
      yards: filteredYards,
      total: filteredYards.length,
      filters: {
        city: city || undefined,
        guests: guests ? parseInt(guests) : undefined,
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : undefined
      }
    });
  } catch (error) {
    console.error('Error fetching yards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
