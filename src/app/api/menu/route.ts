// src/app/api/menu/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 追加
import jwt from 'jsonwebtoken'; // 追加

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string; // 環境変数から取得

export async function POST(request: Request) {
  // ==========================================
  // 🔐 認証チェック（ここが金庫の鍵になります）
  // ==========================================
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth_token');

  // トークンがない、または秘密鍵が設定されていない場合は即座に拒否
  if (!token || !JWT_SECRET) {
    return NextResponse.json({ message: '認証が必要です。' }, { status: 401 });
  }

  try {
    // トークンの署名を検証
    jwt.verify(token.value, JWT_SECRET);
  } catch (error) {
    console.error('API認証エラー:', error);
    // 署名が不正、または期限切れの場合は拒否
    return NextResponse.json({ message: '不正なセッションです。再ログインしてください。' }, { status: 401 });
  }

  // ==========================================
  // ✅ 認証成功後の処理（ここからは安全な領域）
  // ==========================================
  try {
    const body = await request.json();
    const { menuName, price, orderFlg, menuType, detail } = body;

    // 1. menuType から t_id を検索
    const foundMenuType = await prisma.menuType.findUnique({
      where: { t_name: menuType },
      select: { t_id: true },
    });

    if (!foundMenuType) {
      return NextResponse.json({ message: '指定されたカテゴリーが見つかりません。' }, { status: 400 });
    }

    const t_id = foundMenuType.t_id;
    const isOrderable = Boolean(orderFlg);

    // 2. menu テーブルにデータを挿入
    const newMenu = await prisma.menu.create({
      data: {
        m_name: menuName,
        detail: detail,
        orderFlg: isOrderable,
        price: price,
        t_id: t_id,
      },
    });

    return NextResponse.json({ message: 'メニューが正常に登録されました。', menu: newMenu }, { status: 201 });

  } catch (error) {
    console.error('メニュー登録エラー:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'メニュー登録に失敗しました。', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'メニュー登録に失敗しました。', error: '不明なエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}