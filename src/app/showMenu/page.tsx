import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'; 
import OrderManager from '@/components/common/OrderManager';
import  prisma  from '@/lib/prisma';


export default async function ShowMenuPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value; 
  const isLoggedIn = !!authToken;
  
  // データ取得ロジック（変更なし）
  const menuTypeQueryArgs = { include: { menu: true } }; 
  const menuType = await prisma.menuType.findMany(menuTypeQueryArgs);
  const courseCtlQuery = await prisma.courseCtl.findMany({
    include: {
      course: true,
      menu: { select: { m_id: true, m_name: true, price: true, detail: true } },
    },
  });

  // コースデータの整形ロジック（変更なし）
  type GroupedCourse = {
    c_id: number; c_name: string; price: number; detail: string | null; orderFlg: boolean;
    menus: { m_name: string }[]; 
  };
  type GroupedCourseMap = Record<number, GroupedCourse>;

  const groupedCourses = courseCtlQuery.reduce<GroupedCourseMap>((acc, currentCtl) => {
    if (!currentCtl.course || !currentCtl.menu) return acc;
    const c_id = currentCtl.course.c_id;
    if (!acc[c_id]) {
      acc[c_id] = { ...currentCtl.course, menus: [] };
    }
    acc[c_id].menus.push({ m_name: currentCtl.menu.m_name }); 
    return acc;
  }, {} as GroupedCourseMap);

  const finalCourseList = Object.values(groupedCourses);

  return (
    <main className="min-h-screen bg-[#FDFBF9] flex flex-col items-center">
      {/* --- 1. ラ・パウザ風 ヒーローヘッダー --- */}
      <div className="relative h-[300px] w-full flex items-center justify-center bg-[#4A2C2A] overflow-hidden">
        {/* 背景にうっすら料理の雰囲気（後で画像を入れると完璧です） */}
        <div className="absolute inset-0 opacity-30 bg-[url('/Margherita.png')] bg-cover bg-center"></div>
        <div className="relative text-center z-10">
          <h1 className="text-white text-6xl font-serif italic mb-4 tracking-wider">Food Menu</h1>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-[#EBE3D5] text-lg uppercase tracking-[0.2em]">お品書き</p>
        </div>
      </div>

      {/* --- 2. メインコンテンツエリア --- */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <OrderManager 
          menuType={menuType} 
          finalCourseList={finalCourseList} 
          isLoggedIn={isLoggedIn} 
        />
      </div>

      {/* 戻るボタン等のフッター要素（お好みで） */}
      <div className="pb-20 flex justify-center">
        <button className="text-gray-400 hover:text-[#4A2C2A] transition-colors flex items-center gap-2">
          <span>↑</span> Page Top
        </button>
      </div>
    </main>
  );
}