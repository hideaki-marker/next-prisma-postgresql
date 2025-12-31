'use client';

import { useState } from 'react';
import CourseOrderControls from './CourseOrderControls';
import MenuOrderControls from './MenuOrderControls';
import { ShoppingCart, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderManager({ menuType, finalCourseList, isLoggedIn }: any) {
  // 全ての注文を一括管理
  // keyは "course-1" や "menu-3" のようにして一意にします
  const [orders, setOrders] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  // 注文の有無を確認
  const hasOrder = Object.values(orders).some(q => q > 0);

  // 予約処理
  const handleReserve = () => {
    const orderData = Object.entries(orders)
      .filter(([, quantity]) => quantity > 0)
      .map(([key, quantity]) => {
        const [type, id] = key.split('-');
        return { id: parseInt(id), type, quantity };
      });
    
    localStorage.setItem('temp_reservation_order', JSON.stringify(orderData));
    router.push('/reserve');
  };

  return (
    <>
      {/* コースセクション */}
      {finalCourseList && Array.isArray(finalCourseList) && finalCourseList.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-[#4A2C2A]">Course Menu</h2>
            <span className="text-[#8B5E3C] text-sm font-medium">コース料理</span>
            <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
          </div>
          <CourseOrderControls 
                      courseList={finalCourseList}
                      orders={orders}
                      setOrders={setOrders} isLoggedIn={isLoggedIn}/>
        </section>
      )}
      {/* グランドメニューセクション */}
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl flex items-center gap-4 mb-12 mx-auto px-4">
          <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
          <h2 className="text-3xl font-bold text-[#4A2C2A] whitespace-nowrap">Grand Menu</h2>
          <span className="text-[#8B5E3C] text-sm font-medium">アラカルト</span>
          <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
        </div>
        <MenuOrderControls 
                  menuTypes={menuType}
                  orders={orders}
                  setOrders={setOrders} isLoggedIn={isLoggedIn}/>
      </section>

      {/* 統合注文バー（ここに1つだけ配置！） */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#EBE3D5] transition-all duration-300 z-50 flex justify-center items-center gap-4 ${hasOrder ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <p className="hidden sm:block text-[#4A2C2A] font-medium italic">Selected items in your cart...</p>
        {isLoggedIn ? (
          <Button size="lg" onClick={handleReserve} className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 rounded-full shadow-lg flex items-center gap-2">
            <ShoppingCart size={18} />
            <span>注文を確定して予約へ</span>
          </Button>
        ) : (
          <Link href="/login">
            <Button size="lg" className="bg-[#8B5E3C] hover:bg-[#4A2C2A] text-white px-8 rounded-full shadow-lg flex items-center gap-2">
              <LogIn size={18} />
              <span>ログインして予約へ</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}