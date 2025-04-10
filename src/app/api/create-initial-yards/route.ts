import { NextResponse } from 'next/server';
import { createInitialYards } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const result = await createInitialYards();
    
    if (!result.success) {
      console.error('Failed to create initial yards - Full error:', JSON.stringify(result, null, 2));
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-initial-yards route - Full error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      },
      { status: 500 }
    );
  }
} 