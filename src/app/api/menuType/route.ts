// src/app/api/menu-types/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PrismaClient の menuType モデルの型を推論して取得
type MenuTypeItem = Awaited<ReturnType<typeof prisma.menuType.findMany>>[number];

export async function GET() {
  try {
    const menuType: Pick<MenuTypeItem, 't_name'>[] = await prisma.menuType.findMany({
      select: {
        t_name: true, // t_name フィールドのみを選択
      }
    });

    // t_name の配列に変換
     const names = menuType.map(type => type.t_name);

    return NextResponse.json(names, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu types:', error);
    return NextResponse.json({ message: 'Failed to fetch menu types' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}