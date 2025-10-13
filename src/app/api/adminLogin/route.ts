// app/api/admin/login/route.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { name, password } = await req.json();

 console.log('入力されたパスワード:', password); // "admin"と表示されるはず

  if (!name || !password) {
    return NextResponse.json({ message: 'ユーザー名とパスワードを入力してください。' }, { status: 400 });
  }

  try {
    // @unique属性が付いているため、adm_nameのみで検索可能
    const adminUser = await prisma.admin.findUnique({
      where: {
        adm_name: name,
      },
    });
    
    if (!adminUser) {
      console.log('ユーザーが見つかりません:', name); // ★ ユーザーが見つからない場合
      return NextResponse.json({ message: 'ユーザー名またはパスワードが間違っています。' }, { status: 401 });
    }

    console.log('ユーザーが見つかりました:', adminUser); // ★ ユーザーが見つかった場合

    // データベースから取得したハッシュ化されたパスワードと、入力された平文のパスワードを比較
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
  

    console.log('データベースのパスワード:', isPasswordValid); // データベースから取得したハッシュ値

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'ユーザー名またはパスワードが間違っています。' }, { status: 401 });
    }

    const token = jwt.sign({ name: adminUser.adm_name }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json(
      { message: '管理者ログイン成功！', user: { name: adminUser.adm_name } },
      { status: 200 }
    );
    
    // 管理者用のCookieを設定
    response.cookies.set({
      name: 'admin_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('管理者ログイン処理中にエラーが発生しました:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました。' }, { status: 500 });
  }
}