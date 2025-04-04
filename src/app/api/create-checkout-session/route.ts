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
    const body = await request.json();
    console.log('Request body:', body);

    const { yardId, checkIn, checkOut, guests } = body;

    if (!yardId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get yard details from mock data
    const yard = yards.find(y => y.id === parseInt(yardId));
    if (!yard) {
      return NextResponse.json(
        { error: 'Yard not found' },
        { status: 404 }
      );
    }

    // Calculate total amount
    const hours = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60));
    const subtotal = yard.price * hours;
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    console.log('Creating checkout session with:', {
      yardId,
      checkIn,
      checkOut,
      guests,
      total,
    });

    // Get the request URL to construct absolute URLs
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: yard.title,
              description: `Booking from ${new Date(checkIn).toLocaleDateString()} to ${new Date(checkOut).toLocaleDateString()} for ${guests} guests`,
            },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/yards/${yardId}`,
      metadata: {
        yardId: yardId.toString(),
        checkIn: checkIn.toString(),
        checkOut: checkOut.toString(),
        guests: guests.toString(),
      },
    });

    console.log('Checkout session created:', session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 