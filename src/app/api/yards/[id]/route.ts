import { NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Beachfront Garden Oasis",
    city: "Venice",
    price: 90,
    guests: 25,
    image: "/images/yards/Beachfront Garden Oasis.jpg",
    amenities: ["grill", "firepit", "pool"],
    description: "A stunning beachfront garden space in Venice, where the Pacific breeze meets lush greenery. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space. Perfect for intimate gatherings and outdoor dining with ocean views.",
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ["Venice Beach Boardwalk", "Abbot Kinney Blvd", "Santa Monica Pier"]
  },
  {
    id: 2,
    title: "Bohemian Backyard",
    city: "Silver Lake",
    price: 75,
    guests: 15,
    image: "/images/yards/Bohemian Backyard.jpg",
    amenities: ["pool", "hottub", "outdoor_kitchen"],
    description: "A vibrant, artistic outdoor space in the heart of Silver Lake. This eclectic backyard features a large pool, hot tub, and fully equipped outdoor kitchen. The perfect setting for creative gatherings and pool parties with a bohemian flair.",
    rating: 4.9,
    reviews: 31,
    nearbyAttractions: ["Silver Lake Reservoir", "Echo Park Lake", "Dodger Stadium"]
  },
  {
    id: 3,
    title: "Los Angeles Downtown Rooftop",
    city: "Downtown",
    price: 65,
    guests: 20,
    image: "/images/yards/Los Angeles Downtown Rooftop.png",
    amenities: ["outdoor_kitchen", "firepit", "playground"],
    description: "A modern rooftop space with panoramic views of the LA skyline. Features a fully equipped outdoor kitchen, cozy fire pit, and a small playground area for kids. Perfect for corporate events and family gatherings with stunning city views.",
    rating: 4.7,
    reviews: 18,
    nearbyAttractions: ["Staples Center", "Grand Park", "The Broad Museum"]
  },
  {
    id: 4,
    title: "Ocean View Patio",
    city: "Malibu",
    price: 85,
    guests: 20,
    image: "/images/yards/Ocean View Patio.jpg",
    amenities: ["pool", "grill", "playground"],
    description: "A beautiful oceanfront patio in Malibu with direct access to the beach. Features a large pool, outdoor grill, and a playground. Perfect for beach parties and family gatherings with stunning Pacific views and sunset watching.",
    rating: 4.9,
    reviews: 42,
    nearbyAttractions: ["Malibu Pier", "Zuma Beach", "Point Dume"]
  },
  {
    id: 5,
    title: "Santa Monica Garden",
    city: "Santa Monica",
    price: 55,
    guests: 12,
    image: "/images/yards/Santa Monica Garden.jpg",
    amenities: ["firepit", "grill", "hottub"],
    description: "A serene garden space in Santa Monica featuring native California plants and coastal influences. Features a cozy fire pit, outdoor grill, and hot tub. Ideal for intimate gatherings and outdoor dining with a coastal breeze.",
    rating: 4.8,
    reviews: 28,
    nearbyAttractions: ["Santa Monica Pier", "Third Street Promenade", "Palisades Park"]
  },
  {
    id: 6,
    title: "Urban Rooftop Garden",
    city: "West Hollywood",
    price: 60,
    guests: 15,
    image: "/images/yards/Urban Rooftop Garden.jpg",
    amenities: ["pool", "outdoor_kitchen", "firepit"],
    description: "A modern rooftop garden in West Hollywood with city views and desert-inspired landscaping. Features a large pool, fully equipped outdoor kitchen, and fire pit. Perfect for winter gatherings and outdoor dining with a sophisticated urban vibe.",
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