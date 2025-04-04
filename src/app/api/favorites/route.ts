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
    title: 'Luxury Backyard Oasis',
    price: 50,
    image: '/images/yard1.jpg',
    city: 'Los Angeles',
    guests: 10,
    amenities: ['Pool', 'BBQ', 'Fire Pit', 'WiFi'],
  },
  {
    id: 2,
    title: 'Modern Urban Garden',
    price: 35,
    image: '/images/yard2.jpg',
    city: 'San Francisco',
    guests: 8,
    amenities: ['Garden', 'Outdoor Kitchen', 'WiFi'],
  },
  {
    id: 3,
    title: 'Cozy Backyard Retreat',
    price: 25,
    image: '/images/yard3.jpg',
    city: 'New York',
    guests: 6,
    amenities: ['Fire Pit', 'BBQ', 'WiFi'],
  },
];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    const { yardId, action } = await request.json();
    
    if (!yardId || !action) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const currentFavorites = userFavorites.get(userId) || [];

    if (action === 'add') {
      if (!currentFavorites.includes(yardId)) {
        userFavorites.set(userId, [...currentFavorites, yardId]);
      }
    } else if (action === 'remove') {
      userFavorites.set(userId, currentFavorites.filter(id => id !== yardId));
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error updating favorites:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    // In a real application, you would fetch the user's favorites from a database
    // For now, we'll return a mock list of favorite yard IDs
    const favoriteIds = [1, 2]; // Mock favorite yard IDs
    const favoriteYards = yards.filter(yard => favoriteIds.includes(yard.id));

    return new NextResponse(
      JSON.stringify({ favorites: favoriteYards }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 