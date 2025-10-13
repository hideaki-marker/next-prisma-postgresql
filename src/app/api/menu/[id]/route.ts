// src/app/api/menu/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 特定のメニューデータを取得 (GET)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 修正: パスパラメータの取得方法を変更
    // awaitは不要なケースもありますが、エラーを避けるためにasync/awaitのペアで記述します。
    // https://nextjs.org/docs/messages/sync-dynamic-apis⁠
    const id = (await params).id; // URLのパスパラメータからIDを取得

    const menu = await prisma.menu.findUnique({
      where: { m_id: Number(id) }, // m_id は数値型を想定
      include: {
        menuType: {
          select: { t_name: true } // 関連するメニュータイプ名を取得
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
    }

    // 取得したデータをクライアントのフォームスキーマに合うように整形
    // ここで menuType を t_name の文字列に変換するなど調整
    const formattedMenu = {
      id: menu.m_id.toString(), // IDは文字列として返す
      menuName: menu.m_name,
      price: menu.price,
      // ★修正★: Boolean を数値 (1: true, 0: false) に変換して返す
      orderFlg: menu.orderFlg ? 1 : 0, 
      menuType: menu.menuType?.t_name || '', // menuTypeが存在すればt_nameを、なければ空文字列
      detail: menu.detail || '', // detailがnullの場合を考慮
    };

    return NextResponse.json(formattedMenu, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


// 特定のメニューデータを更新 (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
     // 修正: パスパラメータの取得方法を変更
    const id = (await params).id; // URLのパスパラメータからIDを取得
    const body = await request.json();

    console.log("PUT request received for ID:", id); // 追加
    console.log("Request body:", body); // 追加

     // ★重要★: クライアントから送られてきたボディからidとmenuTypeを明示的に除外
    const { id: _, menuType, ...updateData } = body;

    const orderFlgBoolean = Boolean(updateData.orderFlg);
    console.log("Converted orderFlg to boolean:", orderFlgBoolean);

    // menuType名からt_idを取得
    const existingMenuType = await prisma.menuType.findUnique({
      where: { t_name: menuType },
    });

     console.log("Found menuType:", existingMenuType); // 追加

    if (!existingMenuType) {
      return NextResponse.json({ message: 'Invalid menu type provided' }, { status: 400 });
    }

    const updatedMenu = await prisma.menu.update({
      where: { m_id: Number(id) },
      data: {
        m_name: updateData.menuName,
        price: updateData.price,
        orderFlg: orderFlgBoolean,
        t_id: existingMenuType.t_id,
        detail: updateData.detail,
      },
    });

    return NextResponse.json(updatedMenu, { status: 200 });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 必要に応じて、DELETEメソッドもここに追加できます

// DELETE ハンドラ
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;

    // 削除対象のメニューが存在するか確認
    const existingMenu = await prisma.menu.findUnique({
      where: { m_id: Number(id) },
    });

    if (!existingMenu) {
      return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
    }

    // 削除処理を実行
    await prisma.menu.delete({
      where: { m_id: Number(id) },
    });

    return NextResponse.json(
      { message: `Menu with ID ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// export async function DELETE(...) { ... }