// src/app/api/menu/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // フォームから送られてくるデータの型と一致するように定義
    const { menuName, price, orderFlg, menuType, detail } = body;

    // 1. menuType (カテゴリー名) から t_id を検索
    // menuテーブルのt_idはmenuTypeテーブルのt_idを参照しているため、
    // まずmenuTypeのt_nameからt_idを取得する必要があります。
    const foundMenuType = await prisma.menuType.findUnique({
      where: {
        t_name: menuType, // フォームから送られてきたカテゴリー名
      },
      select: {
        t_id: true,
      },
    });

    if (!foundMenuType) {
      // 指定されたカテゴリー名が見つからない場合のエラーハンドリング
      return NextResponse.json({ message: '指定されたカテゴリーが見つかりません。' }, { status: 400 });
    }

    const t_id = foundMenuType.t_id;

    // 2. orderFlg (数値 0/1) を Boolean に変換
    // PrismaのスキーマではBoolean型なので変換が必要です
    const isOrderable = Boolean(orderFlg); // 0はfalse、1はtrueに変換されます

    // 3. menu テーブルにデータを挿入
    const newMenu = await prisma.menu.create({
      data: {
        m_name: menuName, // フォームの menuName を m_name にマッピング
        detail: detail, // フォームの description を detail にマッピング
        orderFlg: isOrderable, // 変換した Boolean 値を使用
        price: price, // フォームの price を price にマッピング
        t_id: t_id, // 検索した t_id を t_id にマッピング
      },
    });

    // 成功レスポンス
    return NextResponse.json({ message: 'メニューが正常に登録されました。', menu: newMenu }, { status: 201 });

  } catch (error) {
    console.error('メニュー登録エラー:', error);
    // エラーレスポンス
    if (error instanceof Error) {
      return NextResponse.json({ message: 'メニュー登録に失敗しました。', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'メニュー登録に失敗しました。', error: '不明なエラー' }, { status: 500 });
  } finally {
    // Prisma Clientの接続を切断 (開発中は不要な場合もありますが、本番環境では重要です)
    await prisma.$disconnect();
  }
}