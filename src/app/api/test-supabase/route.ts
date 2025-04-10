import { NextResponse } from 'next/server';
import { testSupabaseConnection, fetchYards } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test the connection
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: 'Failed to connect to Supabase', details: connectionTest.error },
        { status: 500 }
      );
    }

    // Fetch yards data
    const yardsResult = await fetchYards();
    if (!yardsResult.success) {
      return NextResponse.json(
        { error: 'Failed to fetch yards', details: yardsResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      connection: {
        message: connectionTest.message,
        sampleYard: connectionTest.data
      },
      data: {
        yardsCount: yardsResult.data?.length || 0,
        yards: yardsResult.data || []
      }
    });
  } catch (error) {
    console.error('Error in test-supabase route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 