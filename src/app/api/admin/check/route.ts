import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth_token');

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    jwt.verify(token.value, JWT_SECRET);
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}