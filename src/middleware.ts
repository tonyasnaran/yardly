import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return res;
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/host-dashboard/:path*',
    '/api/auth/google-calendar/:path*',
    '/api/calendar/:path*'
  ],
}; 