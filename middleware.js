import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function middleware(request) {
  console.log("Middleware called for path:", request.nextUrl.pathname);

  const authHeader = request.headers.get('authorization');
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    console.log("No authorization header found");
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

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

export const config = {
  matcher: ['/api/contacts', '/api/contacts/:path*', '/api/files/:path*'],
};