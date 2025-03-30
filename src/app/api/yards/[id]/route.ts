import { NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Garden Oasis",
    city: "Beverly Hills",
    price: 50,
    guests: 10,
    image: "https://source.unsplash.com/random/400x300/?garden",
    amenities: ["grill", "firepit", "pool"],
    description: "A luxurious garden space in the heart of Beverly Hills. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space. Perfect for intimate gatherings and outdoor dining.",
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ["Rodeo Drive", "Beverly Gardens Park", "The Grove"]
  },
  {
    id: 2,
    title: "Poolside Retreat",
    city: "Venice",
    price: 75,
    guests: 15,
    image: "https://source.unsplash.com/random/400x300/?pool",
    amenities: ["pool", "hottub", "outdoor_kitchen"],
    description: "A stunning outdoor space in Venice Beach featuring a large pool, hot tub, and fully equipped outdoor kitchen. Perfect for summer gatherings and pool parties with the beach just steps away.",
    rating: 4.9,
    reviews: 31,
    nearbyAttractions: ["Venice Beach Boardwalk", "Abbot Kinney Blvd", "Santa Monica Pier"]
  },
  {
    id: 3,
    title: "Skyline Rooftop",
    city: "Downtown",
    price: 65,
    guests: 20,
    image: "https://source.unsplash.com/random/400x300/?rooftop",
    amenities: ["outdoor_kitchen", "firepit", "playground"],
    description: "A modern rooftop space with panoramic views of the LA skyline. Features a fully equipped outdoor kitchen, cozy fire pit, and a small playground area for kids. Perfect for corporate events and family gatherings.",
    rating: 4.7,
    reviews: 18,
    nearbyAttractions: ["Staples Center", "Grand Park", "The Broad Museum"]
  },
  {
    id: 4,
    title: "Beachfront Paradise",
    city: "Malibu",
    price: 90,
    guests: 25,
    image: "https://source.unsplash.com/random/400x300/?beach",
    amenities: ["pool", "grill", "playground"],
    description: "A beautiful beachfront property in Malibu with direct access to the ocean. Features a large pool, outdoor grill, and a playground. Perfect for beach parties and family gatherings with stunning Pacific views.",
    rating: 4.9,
    reviews: 42,
    nearbyAttractions: ["Malibu Pier", "Zuma Beach", "Point Dume"]
  },
  {
    id: 5,
    title: "Mountain View Retreat",
    city: "Los Feliz",
    price: 55,
    guests: 12,
    image: "https://source.unsplash.com/random/400x300/?mountain",
    amenities: ["firepit", "grill", "hottub"],
    description: "A serene mountain-view space overlooking Griffith Park. Features a cozy fire pit, outdoor grill, and hot tub. Ideal for stargazing and outdoor gatherings with views of the Hollywood sign.",
    rating: 4.8,
    reviews: 28,
    nearbyAttractions: ["Griffith Observatory", "Hollywood Sign", "Los Angeles Zoo"]
  },
  {
    id: 6,
    title: "Desert Oasis",
    city: "West Hollywood",
    price: 60,
    guests: 15,
    image: "https://source.unsplash.com/random/400x300/?desert",
    amenities: ["pool", "outdoor_kitchen", "firepit"],
    description: "A beautiful desert-inspired landscape in West Hollywood with modern amenities. Features a large pool, fully equipped outdoor kitchen, and fire pit. Perfect for winter gatherings and outdoor dining.",
    rating: 4.7,
    reviews: 35,
    nearbyAttractions: ["Sunset Strip", "Runyon Canyon", "The Comedy Store"]
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