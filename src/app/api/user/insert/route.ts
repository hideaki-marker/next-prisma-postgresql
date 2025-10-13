// app/api/user/insert/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ message: 'ユーザー名とパスワードは必須です。' }, { status: 400 });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prismaを使ってデータベースに新しいユーザーを保存
    const newUser = await prisma.users.create({
      data: {
        name: name,
        password: hashedPassword,
        created_at: new Date(), 
      },
    });

    return NextResponse.json({ message: 'ユーザー登録が完了しました。', user: newUser }, { status: 200 });

  } catch (error) {
    console.error('ユーザー登録中にエラーが発生しました:', error);
    return NextResponse.json({ message: 'ユーザー登録に失敗しました。' }, { status: 500 });
  }
}