'use client';

import { Dispatch, SetStateAction } from 'react'; // 追加
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react'; // アイコン追加

type GroupedCourse = {
  c_id: number;
  c_name: string;
  price: number;
  detail: string | null;
  orderFlg: boolean;
  menus: {
    m_name: string;
  }[]; 
};

// 引数の型定義を更新
interface CourseOrderProps {
  courseList: GroupedCourse[];
  isLoggedIn: boolean;
  orders: { [key: string]: number }; // 親から受け取るState
  setOrders: Dispatch<SetStateAction<{ [key: string]: number }>>; // 親から受け取る更新関数
}

export default function CourseOrderControls({ 
  courseList, 
  orders, 
  setOrders 
}: CourseOrderProps) {
  
  // 数量を変更する関数（親のStateを更新するよう修正）
  const handleQuantityChange = (c_id: number, delta: number) => {
    const key = `course-${c_id}`;
    setOrders(prev => {
      const current = prev[key] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [key]: newQuantity };
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* グリッド幅を MenuOrderControls と合わせるために max-w-4xl を指定
         CodeRabbit指摘の pb-28 は親(OrderManager)に付与するためここでは不要
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 justify-items-center">
        {(courseList || []).map(courseItem => {
          const quantity = orders[`course-${courseItem.c_id}`] || 0;

          return (
            <div key={courseItem.c_id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col border border-[#F3F0EC] w-full p-6 transition-all hover:shadow-md">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-[#4A2C2A]">{courseItem.c_name}</h3>
                  <p className="font-bold text-lg text-[#D32F2F]">
                    <span className="text-sm mr-1">￥</span>{courseItem.price.toLocaleString()}
                  </p>
                </div>
                
                {courseItem.detail && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{courseItem.detail}</p>
                )}
                
                <div className="bg-[#F9F7F5] p-3 rounded-lg mb-4">
                  <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Menu Contents</p>
                  <p className="text-sm italic text-gray-500">
                    {courseItem.menus.map(m => m.m_name).join(' / ')}
                  </p>
                </div>
              </div>
              
              {/* 数量コントロール */}
              <div className="flex items-center space-x-4 justify-end mt-4 pt-4 border-t border-gray-100">
                <Button 
                  onClick={() => handleQuantityChange(courseItem.c_id, -1)} 
                  disabled={quantity === 0} 
                  variant="outline" 
                  size="icon"
                  className="rounded-full w-8 h-8"
                  aria-label={`${courseItem.c_name}の数量を減らす`} // CodeRabbit指摘対応
                >
                  <Minus size={14} />
                </Button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <Button 
                  onClick={() => handleQuantityChange(courseItem.c_id, 1)} 
                  variant="outline" 
                  size="icon"
                  className="rounded-full w-8 h-8"
                  aria-label={`${courseItem.c_name}の数量を増やす`} // CodeRabbit指摘対応
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}