import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { yardId, checkIn, checkOut, guests } = await request.json();

    // Calculate total amount
    const hours = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60));
    const baseRate = 50; // Replace with actual yard rate from database
    const subtotal = baseRate * hours;
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Yard Rental',
              description: `Booking from ${new Date(checkIn).toLocaleString()} to ${new Date(checkOut).toLocaleString()} for ${guests} guests`,
            },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/yard/${yardId}/book`,
      metadata: {
        yardId,
        checkIn: checkIn.toString(),
        checkOut: checkOut.toString(),
        guests: guests.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 