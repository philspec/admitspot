import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

export function generateToken(userId) {
  console.log("Generating token for user:", userId);
  console.log("Using JWT_SECRET:", JWT_SECRET);
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  console.log("Generated token:", token);
  return token;
}

export async function verifyToken(token) {
  try {
    console.log("Verifying token:", token);
    console.log("Using JWT_SECRET:", JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function authenticateToken(request) {
  try {
    const authHeader = request.headers.get('authorization'); // Use request.headers.get()
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error('Error authenticating token:', error);
    return null;
  }
}