// app/api/admin/check/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // 追加

const JWT_SECRET = process.env.JWT_SECRET as string; // 環境変数から取得

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth_token');

  // 1. クッキー自体が存在しない場合は即NG
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // 2. サーバー側に秘密鍵が設定されていない場合のエラーハンドリング
  if (!JWT_SECRET) {
    console.error('JWT_SECRETが設定されていません。');
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }

  try {
    // 3. トークンの正当性を検証 (署名チェック + 有効期限チェック)
    jwt.verify(token.value, JWT_SECRET);
    
    // 検証成功
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    // 署名が違う、有効期限切れ、改ざんされている場合はここに来る
    console.error('JWT検証失敗:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}