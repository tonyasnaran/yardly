import { NextRequest, NextResponse } from 'next/server';

// Mock data for initial development
const mockYards = [
  {
    id: 1,
    title: "Tranquil Garden Oasis",
    city: "Seattle",
    price: 75,
    guests: 15,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
    amenities: ["Grill", "Fire Pit", "Lounge Area", "Garden", "Lighting"],
    description: "A peaceful garden space perfect for intimate gatherings and outdoor dining. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space.",
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ["Pike Place Market", "Space Needle", "Discovery Park"]
  },
  {
    id: 2,
    title: "Urban Rooftop Retreat",
    city: "Portland",
    price: 90,
    guests: 20,
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
    amenities: ["Pool", "BBQ Station", "Covered Seating", "Bar", "Sound System"],
    description: "A stunning rooftop space with panoramic city views. Perfect for pool parties and social events with a full outdoor kitchen and bar setup.",
    rating: 4.9,
    reviews: 36,
    nearbyAttractions: ["Pearl District", "Forest Park", "Japanese Garden"]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const yardId = parseInt(id);

    if (isNaN(yardId)) {
      return NextResponse.json({ error: 'Invalid yard ID' }, { status: 400 });
    }

    const yard = mockYards.find(y => y.id === yardId);

    if (!yard) {
      return NextResponse.json({ error: 'Yard not found' }, { status: 404 });
    }

    return NextResponse.json(yard);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 