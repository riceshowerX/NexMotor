import { NextRequest } from 'next/server';
import { verifyJWT } from './jwt';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);

    if (!decoded) {
      return null;
    }

    // 支持两种payload格式: id 或 userId
    const userId = (decoded as any).id || decoded.userId;
    if (!userId) {
      return null;
    }

    return {
      id: userId,
      username: decoded.username || '',
      email: decoded.email || '',
      role: (decoded.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
    };
  } catch (error) {
    return null;
  }
}

export function requireAdmin(request: NextRequest): AuthUser | null {
  const user = getAuthUser(request);
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}
