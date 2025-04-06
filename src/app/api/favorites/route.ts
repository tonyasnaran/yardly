import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for favorites
// In a real application, this would be a database
const userFavorites = new Map<string, number[]>();

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Beachfront Garden Oasis",
    city: "Venice",
    price: 90,
    guests: 25,
    image: "/images/yards/Beachfront Garden Oasis.jpg",
    amenities: ["Grill", "Fire Pit", "Pool"],
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
    amenities: ["Pool", "Hot Tub", "Outdoor Kitchen"],
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
    amenities: ["Outdoor Kitchen", "Fire Pit", "Playground"],
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
    amenities: ["Pool", "Grill", "Playground"],
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
    amenities: ["Fire Pit", "Grill", "Hot Tub"],
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
    amenities: ["Pool", "Outdoor Kitchen", "Fire Pit"],
    description: "A modern rooftop garden in West Hollywood with city views and desert-inspired landscaping. Features a large pool, fully equipped outdoor kitchen, and fire pit. Perfect for winter gatherings and outdoor dining with a sophisticated urban vibe.",
    rating: 4.7,
    reviews: 35,
    nearbyAttractions: ["Sunset Strip", "Runyon Canyon", "The Comedy Store"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const favorites = userFavorites.get(userEmail) || [];
    
    // Get full yard details for each favorite
    const favoriteYards = yards.filter(yard => favorites.includes(yard.id));

    return NextResponse.json({ yards: favoriteYards });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { yardId } = body;

    if (!yardId) {
      return NextResponse.json(
        { error: 'Yard ID is required' },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const currentFavorites = userFavorites.get(userEmail) || [];
    
    // Toggle favorite status
    const updatedFavorites = currentFavorites.includes(yardId)
      ? currentFavorites.filter(id => id !== yardId)
      : [...currentFavorites, yardId];

    userFavorites.set(userEmail, updatedFavorites);

    return NextResponse.json({ 
      success: true,
      favorites: updatedFavorites 
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 