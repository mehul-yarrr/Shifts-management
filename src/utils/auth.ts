import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import type { UserPayload, UserRole } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookieToken = request.cookies.get('token')?.value;
  return cookieToken || null;
}

export function getCurrentUser(request: NextRequest): UserPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): UserPayload {
  const user = getCurrentUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function requireRole(request: NextRequest, allowedRoles: UserRole[]): UserPayload {
  const user = requireAuth(request);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === 'admin';
}

export function isEmployee(user: UserPayload | null): boolean {
  return user?.role === 'employee';
}

