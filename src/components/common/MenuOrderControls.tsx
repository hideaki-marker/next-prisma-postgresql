'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReturnButton from './ReturnButton';


// ★Prismaから取得されるデータ構造に合わせて型を定義
type MenuItem = {
  m_id: number;
  m_name: string;
  detail: string | null;
  price: number;
};

type MenuTypeWithMenu = {
  t_id: number;
  t_name: string | null;
  menu: MenuItem[];
};

const RESERVATION_ORDER_KEY = 'temp_reservation_order';

export default function MenuOrderControls({ menuTypes, isLoggedIn }: { menuTypes: MenuTypeWithMenu[], isLoggedIn: boolean }) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const router = useRouter(); 
  
  // 数量を変更する関数
  const handleQuantityChange = (m_id: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[m_id] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [m_id]: newQuantity };
    });
  };

  // 注文を確定し、予約ページへリダイレクトする関数
  const handleReserve = () => {
    // 数量が0より大きいアイテムだけを抽出し、注文データを作成
    const orderData = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([m_id, quantity]) => ({
        m_id: parseInt(m_id),
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
      
      {/* ★分類ごとにメニューを表示するループ処理 */}
      {menuTypes.map(type => (
        <div key={type.t_id} className="mb-12">
          {/* ★t_name が null でないかチェックを追加 */}
          <h2 className="font-bold text-3xl mb-6 border-b-2 pb-2 border-gray-200 text-center">
            ● {type.t_name ?? '分類名なし'} 
          </h2>
          
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 px-4 w-full">
            {type.menu.length > 0 ? (
              type.menu.map(menuItem => (
                <div key={menuItem.m_id} className="p-4 border rounded-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-xl mb-1">{menuItem.m_name}</p>
                    {menuItem.detail && (
                      <p className="text-gray-600 text-sm mb-2">{menuItem.detail}</p>
                    )}
                    <p className="font-semibold text-lg text-right">
                      <span className="text-sm mr-1">￥</span>{menuItem.price.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* 数量コントロール */}
                  <div className="flex items-center space-x-2 justify-end mt-4">
                    <Button 
                      onClick={() => handleQuantityChange(menuItem.m_id, -1)} 
                      disabled={(quantities[menuItem.m_id] || 0) === 0} 
                      variant="outline"
                      size="sm"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-bold">
                      {quantities[menuItem.m_id] || 0}
                    </span>
                    <Button 
                      onClick={() => handleQuantityChange(menuItem.m_id, 1)} 
                      variant="outline"
                      size="sm"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">このカテゴリーにはまだメニューがありません。</p>
            )}
          </div>
        </div>
      ))}


      <div className="mt-12 pt-6 border-t border-gray-200 text-center">
        {/* ログインと注文の両方を満たす場合のみ予約ボタンを表示 */}
        {isLoggedIn ? (
          <Button
            size="lg"
            onClick={handleReserve} 
            disabled={!hasOrder} 
            className="bg-black hover:bg-gray-800 text-white text-lg py-4"
          >
            メニューを確定し、予約へ進む
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-red-500 font-semibold">
              メニューを注文して予約に進むには、ログインが必要です。
            </p>
            <Link href="/login" passHref>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg py-4">
                ログインして予約へ
              </Button>
            </Link>
          </div>
        )}
        <ReturnButton 
            isLoggedIn={isLoggedIn}
          />
      </div>
    </div>
  );
}