import { NextResponse } from 'next/server';
import { inspectYardsTable } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const result = await inspectYardsTable();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to inspect yards table', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in inspect-yards route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 