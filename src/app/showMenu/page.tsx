// app/showMenu/page.tsx (修正後のコード)

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'; 
import MenuOrderControls from '@/components/common/MenuOrderControls'; // クライアントコンポーネントをインポート
import CourseOrderControls from '@/components/common/CourseOrderControls';

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
  const courseCtlQuery = await prisma.courseCtl.findMany({
    // ★ リレーション先の course と menu の両方を include する必要があります
    include: {
        course: true, // course モデルの全フィールドを含める (c_name、priceなどが含まれる)
        menu: { // menu モデルを含める
            select: {
                m_id: true,
                m_name: true,
                price: true,
                detail: true,
                // menuTypeが必要であればさらにネスト
                // menuType: { select: { t_name: true } }
            }
        },
    }
});

// このクエリ結果を courseCtl に代入してコンポーネントに渡します
type GroupedCourse = {
    c_id: number;
    c_name: string;
    price: number;
    detail: string | null;
    orderFlg: boolean;
    // このコースに含まれるメニューのリスト
    menus: {
        m_name: string;
        // 必要に応じて他のメニュー情報も追加
    }[]; 
};

// 取得した courseCtl の配列をグループ化する
type GroupedCourseMap = Record<number, GroupedCourse>;

const groupedCourses = courseCtlQuery.reduce<GroupedCourseMap>((acc, currentCtl) => {
    if (!currentCtl.course || !currentCtl.menu) { 
        // データが不完全なレコードはスキップする
        console.warn('Skipping courseCtl record due to missing relation data:', currentCtl);
        return acc;
    }
    // -------------------------------------------------------------
    
    const c_id = currentCtl.course.c_id;
    
    // 既存のコースがない場合、新しいコースオブジェクトを作成
    if (!acc[c_id]) {
        acc[c_id] = {
            c_id: currentCtl.course.c_id,
            c_name: currentCtl.course.c_name,
            price: currentCtl.course.price,
            detail: currentCtl.course.detail,
            orderFlg: currentCtl.course.orderFlg,
            menus: [], // メニューリストはここで初期化
        };
    }
    
    // 現在のメニューをコースのメニューリストに追加
    acc[c_id].menus.push({ m_name: currentCtl.menu.m_name }); 
    
    return acc;
}, {} as GroupedCourseMap);

const finalCourseList = Object.values(groupedCourses);
  

  return (
    <div>
      <div className="flex justify-center mb-10">
        <h1 className="font-bold text-5xl">メニュー一覧</h1>
      </div>

      {/* ★修正：分類情報を含んだ menuType をそのまま渡します。 */}
      <MenuOrderControls menuTypes={menuType} isLoggedIn={isLoggedIn} />
      <CourseOrderControls courseList={finalCourseList} isLoggedIn={isLoggedIn} />
      {/* 固定表示やReturnButtonは、MenuOrderControls内に統合することを推奨します。 */}
    </div>
  );
}