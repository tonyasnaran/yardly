import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for favorites
// In a real application, this would be a database
const userFavorites = new Map<string, number[]>();

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
    const userId = session.user.id;
    const favorites = userFavorites.get(userId) || [];

    return new NextResponse(
      JSON.stringify({ favorites }),
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