// app/api/login/route.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { name, password } = await req.json();

  if (!name || !password) {
    return NextResponse.json({ message: 'ユーザー名とパスワードを入力してください。' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({ where: { name: name } });
    if (!user) {
      return NextResponse.json({ message: 'ユーザー名またはパスワードが間違っています。' }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'ユーザー名またはパスワードが間違っています。' }, { status: 401 });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ message: 'ログイン成功！' }, { status: 200 });
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    response.cookies.set({
      name: 'is_logged_in',
      value: 'true',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('ログイン処理中にエラーが発生しました:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました。' }, { status: 500 });
  }
}