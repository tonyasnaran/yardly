import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for favorites
// In a real application, this would be a database
const userFavorites = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { yardId, action } = body;

    if (!yardId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const favorites = userFavorites.get(userId) || [];

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 