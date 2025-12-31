'use client';

import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import ReturnButton from './ReturnButton';

// 型定義（変更なし）
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

interface MenuOrderProps {
  menuTypes: MenuTypeWithMenu[];
  isLoggedIn: boolean;
  orders: { [key: string]: number };
  setOrders: Dispatch<SetStateAction<{ [key: string]: number }>>;
}

const MENU_IMAGE_MAP: Record<number, string> = {
  1: "ikasumipasta.png",
  2: "SautéedWhiteFish.png",
  3: "hamsalad.png",
  4: "StrawberryParfait.png",
  5: "Napolitan.png",
  6: "Carbonara.png",
};

export default function MenuOrderControls({ 
  menuTypes, 
  isLoggedIn, 
  orders, 
  setOrders 
}: MenuOrderProps) {
  
  // 数量を変更する関数（menu- というプレフィックスを付けて管理）
  const handleQuantityChange = (m_id: number, delta: number) => {
    const key = `menu-${m_id}`;
    setOrders(prev => {
      const current = prev[key] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [key]: newQuantity };
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {menuTypes.map(type => (
        <div key={type.t_id} className="w-full mb-16 flex flex-col items-center">
          <div className="w-full max-w-4xl flex items-center justify-center gap-6 mb-8 px-4">
            <div className="h-[1px] bg-[#EBE3D5] flex-grow"></div>
            <h2 className="italic text-4xl text-[#4A2C2A] whitespace-nowrap">
              {type.t_name ?? 'Other Menu'}
            </h2>
            <div className="h-[1px] bg-[#EBE3D5] flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 justify-items-center">
            {type.menu.length > 0 ? (
              type.menu.map(menuItem => {
                const quantity = orders[`menu-${menuItem.m_id}`] || 0;
                
                return (
                  <div key={menuItem.m_id} 
                       className="bg-white rounded-2xl overflow-hidden shadow-sm flex h-48 border border-[#F3F0EC] w-full group">
                    
                    {/* 左側：画像エリア（onErrorを削除し事前に決定） */}
                    <div className="relative w-2/5 h-full overflow-hidden bg-[#F9F7F5]">
                      <Image 
                        src={MENU_IMAGE_MAP[menuItem.m_id] ? `/${MENU_IMAGE_MAP[menuItem.m_id]}` : "/file.svg"}
                        alt={menuItem.m_name}
                        fill
                        sizes="(max-width: 768px) 40vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* 右側：コンテンツ */}
                    <div className="w-3/5 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{menuItem.m_name}</h3>
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2">
                          {menuItem.detail || "素材の味を活かしたこだわりの一品です。"}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-[#8B5E3C]">
                            {menuItem.price.toLocaleString()}<span className="text-xs ml-1 text-gray-400">円</span>
                          </span>
                          <span className="text-[10px] text-gray-400">(税込価格)</span>
                        </div>

                        {/* 数量コントロール（aria-labelを追加） */}
                        <div className="flex items-center bg-[#F9F7F5] rounded-full p-1 border border-[#EBE3D5]">
                          <button 
                            onClick={() => handleQuantityChange(menuItem.m_id, -1)}
                            disabled={quantity === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                            aria-label={`${menuItem.m_name}の数量を減らす`}
                          >
                            <Minus size={14} className="text-[#4A2C2A]" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm text-[#4A2C2A]">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(menuItem.m_id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            aria-label={`${menuItem.m_name}の数量を増やす`}
                          >
                            <Plus size={14} className="text-[#4A2C2A]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 col-span-2 py-10">🍽️準備中です...</p>
            )}
          </div>
        </div>
      ))}

      {/* 重複していた固定バーは削除しました。OrderManagerが担当します */}

      <div className="mt-20 pb-10 flex flex-col items-center gap-6">
        <ReturnButton isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}