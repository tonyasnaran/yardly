import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Beachfront Garden Oasis",
    price: 90,
  },
  {
    id: 2,
    title: "Bohemian Backyard",
    price: 75,
  },
  {
    id: 3,
    title: "Los Angeles Downtown Rooftop",
    price: 65,
  },
  {
    id: 4,
    title: "Ocean View Patio",
    price: 85,
  },
  {
    id: 5,
    title: "Santa Monica Garden",
    price: 55,
  },
  {
    id: 6,
    title: "Urban Rooftop Garden",
    price: 60,
  }
];

export async function POST(request: Request) {
  try {
    // Log the raw request for debugging
    console.log('Incoming request URL:', request.url);
    
    const body = await request.json();
    console.log('Request body:', body);

    const { yardId, checkIn, checkOut, guests } = body;

    // Validate required fields
    if (!yardId || !checkIn || !checkOut || !guests) {
      console.error('Missing required fields:', { yardId, checkIn, checkOut, guests });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse and validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      console.error('Invalid dates:', { checkIn, checkOut });
      return NextResponse.json(
        { error: 'Invalid dates provided' },
        { status: 400 }
      );
    }

    // Get yard details from mock data
    const yard = yards.find(y => y.id === parseInt(yardId));
    if (!yard) {
      console.error('Yard not found:', yardId);
      return NextResponse.json(
        { error: 'Yard not found' },
        { status: 404 }
      );
    }

    // Calculate total amount
    const hours = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60));
    
    if (hours <= 0) {
      console.error('Invalid booking duration:', hours);
      return NextResponse.json(
        { error: 'Check-out time must be after check-in time' },
        { status: 400 }
      );
    }

    const subtotal = yard.price * hours;
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    console.log('Price calculation:', {
      hours,
      basePrice: yard.price,
      subtotal,
      serviceFee,
      total
    });

    // Get the base URL for the environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.goyardly.com';
    console.log('Using base URL:', baseUrl);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: yard.title,
              description: `Booking from ${checkInDate.toLocaleDateString()} to ${checkOutDate.toLocaleDateString()} for ${guests} guests`,
            },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/${'{CHECKOUT_SESSION_ID}'}`,
      cancel_url: `${baseUrl}/yards/${yardId}/book`,
      metadata: {
        yardId: yardId.toString(),
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests.toString(),
      },
    });

    console.log('Checkout session created:', {
      sessionId: session.id,
      successUrl: session.success_url,
      cancelUrl: session.cancel_url
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 