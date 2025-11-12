'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const RESERVATION_ORDER_KEY = 'temp_reservation_order';

export default function CourseOrderControls({ courseList, isLoggedIn }: { courseList: GroupedCourse[], isLoggedIn: boolean}) {
    console.log('CourseOrderControls received courseList:', courseList);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const router = useRouter(); 
  
  // 数量を変更する関数
  const handleQuantityChange = (c_id: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[c_id] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [c_id]: newQuantity };
    });
  };

  // 注文を確定し、予約ページへリダイレクトする関数
  const handleReserve = () => {
    // 数量が0より大きいアイテムだけを抽出し、注文データを作成
    const orderData = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([c_id, quantity]) => ({
        m_id: parseInt(c_id),
        quantity: quantity,
      }));
    
    // 注文データを一時的に localStorage に保存
    localStorage.setItem(RESERVATION_ORDER_KEY, JSON.stringify(orderData));
    
    // 予約ページへ遷移
    router.push('/reserve');
  };

  // 注文されたアイテムがあるかチェック
  const hasOrder = Object.values(quantities).some(q => q > 0);

  return (
        <div className="p-4">
             {/* 分類ループを削除し、コースリストを直接ループ */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-6 px-4">
            {(courseList || []).map(courseItem => ( // ★ courseList をループ
                <div key={courseItem.c_id} className="p-4 border rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="font-bold text-xl mb-1">{courseItem.c_name}</p>
                        {courseItem.detail && (
                            <p className="text-gray-600 text-sm mb-2">{courseItem.detail}</p>
                        )}
                        {/* 含まれるメニューリストを表示 */}
                        <p className="text-sm italic text-gray-500 my-2">
                           [含まれるメニュー: {courseItem.menus.map(m => m.m_name).join(', ')}]
                        </p>
                        <p className="font-semibold text-lg text-right">
                            <span className="text-sm mr-1">￥</span>{courseItem.price.toLocaleString()}
                        </p>
                    </div>
                    
                    {/* 数量コントロール (c_idで管理) */}
                    <div className="flex items-center space-x-2 justify-end mt-4">
                        {/* c_id を使って数量を管理 */}
                        <Button onClick={() => handleQuantityChange(courseItem.c_id, -1)} disabled={(quantities[courseItem.c_id] || 0) === 0} variant="outline" size="sm">-</Button>
                        <span className="w-8 text-center font-bold">{quantities[courseItem.c_id] || 0}</span>
                        <Button onClick={() => handleQuantityChange(courseItem.c_id, 1)} variant="outline" size="sm">+</Button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}