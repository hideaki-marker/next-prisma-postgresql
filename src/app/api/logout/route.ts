import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const response = NextResponse.json({ message: 'ログアウトしました' }, { status: 200 });

  // NextResponseのcookiesプロパティを使ってCookieを削除
  response.cookies.delete('auth_token');
  response.cookies.delete('is_logged_in');

  return response;
}