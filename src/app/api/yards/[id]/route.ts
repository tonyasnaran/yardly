import { NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Beachfront Garden Oasis",
    price: 90,
    image: "/images/yards/Beachfront Garden Oasis.jpg",
  },
  {
    id: 2,
    title: "Bohemian Backyard",
    price: 75,
    image: "/images/yards/Bohemian Backyard.jpg",
  },
  {
    id: 3,
    title: "Los Angeles Downtown Rooftop",
    price: 65,
    image: "/images/yards/Los Angeles Downtown Rooftop.jpg",
  },
  {
    id: 4,
    title: "Ocean View Patio",
    price: 85,
    image: "/images/yards/Ocean View Patio.jpg",
  },
  {
    id: 5,
    title: "Santa Monica Garden",
    price: 55,
    image: "/images/yards/Santa Monica Garden.jpg",
  },
  {
    id: 6,
    title: "Urban Rooftop Garden",
    price: 60,
    image: "/images/yards/Urban Rooftop Garden.jpg",
  }
];

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const yard = yards.find(y => y.id === parseInt(params.id));
    
    if (!yard) {
      return new NextResponse(
        JSON.stringify({ error: 'Yard not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify(yard),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in yards API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 