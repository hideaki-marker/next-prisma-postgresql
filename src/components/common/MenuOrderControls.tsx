'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart, LogIn } from 'lucide-react'; // アイコンを追加
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

//メニュー画像のマッピング
const MENU_IMAGE_MAP: Record<number, string> = {
  1: "ikasumipasta.png",
  2: "SautéedWhiteFish.png",
  3: "hamsalad.png",
  4: "StrawberryParfait.png",
  5: "Napolitan.png",
  6: "Carbonara.png",
  // IDが増えたらここに追加するだけ！
};

const RESERVATION_ORDER_KEY = 'temp_reservation_order';

export default function MenuOrderControls({ menuTypes, isLoggedIn }: { menuTypes: MenuTypeWithMenu[], isLoggedIn: boolean }) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const router = useRouter(); 
  
  const handleQuantityChange = (m_id: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[m_id] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [m_id]: newQuantity };
    });
  };

  const handleReserve = () => {
    const orderData = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([m_id, quantity]) => ({
        m_id: parseInt(m_id),
        quantity: quantity,
      }));
    localStorage.setItem(RESERVATION_ORDER_KEY, JSON.stringify(orderData));
    router.push('/reserve');
  };

  const hasOrder = Object.values(quantities).some(q => q > 0);

  return (
    <div className="w-full flex flex-col items-center pb-28">
      {menuTypes.map(type => (
        <div key={type.t_id} className="w-full mb-16 flex flex-col items-center">
          {/* カテゴリー見出し：ラ・パウザ風に中央寄せ＋装飾 */}
          <div className="w-full max-w-4xl flex items-center justify-center gap-6 mb-8 px-4">
            <div className="h-[1px] bg-[#EBE3D5] flex-grow"></div>
            <h2 className="italic text-4xl text-[#4A2C2A] whitespace-nowrap">
              {type.t_name ?? 'Other Menu'}
            </h2>
            <div className="h-[1px] bg-[#EBE3D5] flex-grow"></div>
          </div>
          
          {/* カードレイアウト：2列表示（デスクトップ） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 justify-items-center">
            {type.menu.length > 0 ? (
              type.menu.map(menuItem => (
                <div key={menuItem.m_id} 
                     className="bg-white rounded-2xl overflow-hidden shadow-sm flex h-48 border border-[#F3F0EC] w-full group">
                  
                  {/* 左側：画像エリア */}
                  <div className="relative w-2/5 h-full overflow-hidden bg-[#F9F7F5]">
                    <Image 
                      src={
                            MENU_IMAGE_MAP[menuItem.m_id] 
                              ? `/${MENU_IMAGE_MAP[menuItem.m_id]}` // マップにあればそのファイル名
                              : "/file.svg"                    // なければデフォルト画像
                          }
                      alt={menuItem.m_name}
                      fill
                      sizes="(max-width: 768px) 40vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/file.svg";
                      }}                    />
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

                      {/* 数量コントロール：より洗練されたデザイン */}
                      <div className="flex items-center bg-[#F9F7F5] rounded-full p-1 border border-[#EBE3D5]">
                        <button 
                          onClick={() => handleQuantityChange(menuItem.m_id, -1)}
                          disabled={!quantities[menuItem.m_id]}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                          aria-label={`${menuItem.m_name}の数量を減らす`}
                        >
                          <Minus size={14} className="text-[#4A2C2A]" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-[#4A2C2A]">
                          {quantities[menuItem.m_id] || 0}
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
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2 py-10">🍽️準備中です...</p>
            )}
          </div>
        </div>
      ))}

      {/* 1. フッター固定注文バー（hasOrderがtrueの時だけ出現） */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#EBE3D5] transition-all duration-300 z-50 flex justify-center items-center gap-4 ${hasOrder ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <p className="hidden sm:block text-[#4A2C2A] font-medium italic">
          Selected Menu items...
        </p>

        {isLoggedIn ? (
          /* ログイン済み：予約へ進むボタン */
          <Button
            size="lg"
            onClick={handleReserve} 
            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 rounded-full shadow-lg flex items-center gap-2 transform active:scale-95 transition-transform"
          >
            <ShoppingCart size={18} />
            <span>注文を確定して予約へ</span>
          </Button>
        ) : (
          /* 未ログイン：ログインを促すボタン */
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[#8B5E3C] hover:bg-[#4A2C2A] text-white px-8 rounded-full shadow-lg flex items-center gap-2"
            >
              <LogIn size={18} />
              <span>ログインして予約へ</span>
            </Button>
          </Link>
        )}
      </div>

      {/* 2. ページ最下部のエリア（ボタンを削除し、戻るボタンだけに整理） */}
      <div className="mt-20 pb-10 flex flex-col items-center gap-6">
        {/* 以前ここに置いていた重複する予約ボタンは削除！ */}
        
        {/* ログインしていない場合の注意書き（任意） */}
        {!isLoggedIn && hasOrder && (
          <p className="text-[#D32F2F] font-medium text-sm">
            ※ 予約を確定するにはログインが必要です
          </p>
        )}

        <ReturnButton isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}