import { NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Cozy Backyard Garden",
    city: "New York",
    price: 50,
    guests: 10,
    image: "https://source.unsplash.com/random/400x300/?garden",
    amenities: ["grill", "firepit", "pool"],
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
    amenities: ["pool", "hottub", "outdoor_kitchen"],
    description: "A stunning outdoor space featuring a large pool, hot tub, and fully equipped outdoor kitchen. Perfect for summer gatherings and pool parties.",
    rating: 4.9,
    reviews: 31,
    nearbyAttractions: ["Hollywood Sign", "Griffith Observatory", "Santa Monica Pier"]
  }
];

type RouteParams = {
  id: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await context.params;
    const yard = yards.find(y => y.id === parseInt(id));

    if (!yard) {
      return NextResponse.json(
        { error: 'Yard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(yard);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 