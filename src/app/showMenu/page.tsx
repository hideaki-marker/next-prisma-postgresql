// app/showMenu/page.tsx (修正後のコード)

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'; 
import MenuOrderControls from '@/components/common/MenuOrderControls'; // クライアントコンポーネントをインポート


// Prisma Clientのインスタンスを作成
const prisma = new PrismaClient(); 

export default async function ShowMenuPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value; 
  const isLoggedIn = !!authToken;
  
  // データベースからmenuTypeデータを取得（メニューをネストして取得）
  const menuTypeQueryArgs = {
    include: {
      menu: true, 
    },
  }; 

  // ★修正なし：menuType変数に分類ごとのメニュー結果を格納
  const menuType = await prisma.menuType.findMany(menuTypeQueryArgs);
  // 型定義はそのまま利用
  // type MenuTypeWithIncludedMenu = typeof menuType[number]; 
  
  // ★修正：allMenuItemsの作成は不要になりました。

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-10">
        <h1 className="font-bold text-5xl">メニュー一覧</h1>
      </div>

      {/* ★修正：分類情報を含んだ menuType をそのまま渡します。 */}
      <MenuOrderControls menuTypes={menuType} isLoggedIn={isLoggedIn} />
      
      {/* 固定表示やReturnButtonは、MenuOrderControls内に統合することを推奨します。 */}
    </div>
  );
}