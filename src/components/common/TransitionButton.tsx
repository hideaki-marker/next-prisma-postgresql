"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"; // cn ユーティリティ (クラス名結合用) をインポート

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
// コンポーネントが受け取る Props の型を定義
interface TransitionButtonProps extends ButtonProps {
  href: string; // 必須：遷移先のパス
  loadingText?: string; 
  children: React.ReactNode; 
}

export const TransitionButton = React.forwardRef<HTMLButtonElement, TransitionButtonProps>(
  ({ href, loadingText = "お待ち下さい...", children, className, ...props }, ref) => {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // ローディング状態を内部で管理

    // ボタンがクリックされたときのハンドラ
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // ローディング状態を開始
      setIsLoading(true);

      // 遷移を実行
      router.push(href);

      // ★注意: 通常、遷移が完了するとコンポーネントはアンマウントされるため、
      // setIsLoading(false) は不要です。
    };

    return (
      <Button
        ref={ref}
        type="button" // フォーム送信ではないので type="button"
        disabled={isLoading} // ローディング中は無効化
        // 共通のスタイルと外部からのクラスを結合
        className={cn("cursor-pointer", className)} 
        onClick={handleClick} // クリックハンドラを適用
        {...props} 
      >
        {isLoading ? (
          // ローディング中の表示
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 !h-8 !w-8 animate-spin" />
            {loadingText}
          </div>
        ) : (
          // 通常の表示
          children
        )}
      </Button>
    );
  }
);

TransitionButton.displayName = "TransitionButton";