import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = 'secret'; // Replace with your actual secret key

export async function generateToken(userId) {
  console.log("Generating token for user:", userId);
  console.log("Using JWT_SECRET:", JWT_SECRET);

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(JWT_SECRET));

  console.log("Generated token:", token);
  return token;
}

export async function verifyToken(token) {
  try {
    console.log("Verifying token:", token);
    console.log("Using JWT_SECRET:", JWT_SECRET);

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    console.log("Decoded token:", payload);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function authenticateToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error('Error authenticating token:', error);
    return null;
  }
}