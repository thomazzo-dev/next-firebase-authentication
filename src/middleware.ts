// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  //
  response.headers.set('x-url', request.url);
  return response;
}

// allow the middleware to run on all paths except for API routes and static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
};