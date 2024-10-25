import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export const config = {
  matcher: ['/((?!api/auth/register|api/auth/login).*)'], // Exclude register and login routes
};

export async function middleware(request) {
  console.log("Middleware called for path:", request.nextUrl.pathname);

  const authHeader = request.headers.get('authorization');
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    if (request.nextUrl.pathname.startsWith('/api/auth/register') || 
        request.nextUrl.pathname.startsWith('/api/auth/login')) {
      // Allow unauthenticated requests for register and login
      return NextResponse.next();
    } else {
      // Handle unauthenticated requests for other routes
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  console.log("Authorization header:", authHeader);
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    console.log("Invalid authorization header format");
    return new NextResponse(
      JSON.stringify({ error: 'Invalid authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    console.log("Attempting to verify token:", token);
    const decoded = await verifyToken(token);
    console.log("Token verification result:", decoded);

    if (!decoded) {
      console.log("Invalid token");
      return new NextResponse(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("Token verified successfully for user:", decoded.userId);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}