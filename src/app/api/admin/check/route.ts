// app/api/admin/check/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth_token');

  // トークンが存在しない場合
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // 本来はここで jwt.verify(token.value, JWT_SECRET) を行うのがベストです
  return NextResponse.json({ authenticated: true }, { status: 200 });
}