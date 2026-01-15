'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  isLoggedIn: boolean;
  returnUrl?: string; // 任意の遷移先URL（オプショナル）
};

/**
 * 戻るボタンコンポーネント（ローダー付き）
 * @description クリック時にローディング状態を表示し、指定のURLへ遷移します。
 */
export default function ReturnButton({ isLoggedIn, returnUrl }: Props) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  // 1. returnUrlがあればそれを使い、なければログイン状態で判定する
  const finalHref = returnUrl || (isLoggedIn ? '/myPage' : '/');

  // クリック時の処理
  const handleNavigation = () => {
    setIsNavigating(true);
    router.push(finalHref);
  };
  
  return (
      <div className="flex items-center justify-center mb-16">
      <Button
        variant="outline"
        className="bg-black text-white hover:bg-gray-800 hover:text-white text-2xl !px-12 !py-6"
        onClick={handleNavigation}
        disabled={isNavigating} // 遷移中の連打防止
      >
        {isNavigating ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            読み込み中...
          </>
        ) : (
          '戻る'
        )}
      </Button>
      </div>
  );
}