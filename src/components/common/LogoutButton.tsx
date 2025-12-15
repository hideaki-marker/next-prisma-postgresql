'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // shadcn/uiのButtonコンポーネントを想定
import { toast } from 'sonner';
import { useState } from 'react'; // ★1. useStateをインポート
import { Loader2 } from 'lucide-react'; // ★2. Loader2アイコンをインポート

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // ★3. ローディング状態を追加

  const handleLogout = async () => {
    setIsLoading(true); // ★4. 処理開始時にローディングをtrueに
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // ログアウト成功時にトースト通知を表示
        toast.success('ログアウトしました');
        // 2秒後にホーム画面にリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error('ログアウトに失敗しました');
        console.error('ログアウトに失敗しました');
      }
    } catch (error) {
      toast.error('ネットワークエラーが発生しました');
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="outline" 
      disabled={isLoading} // ★7. ローディング中はボタンを無効化
      className="bg-black text-white hover:bg-gray-800 hover:text-white text-2xl !px-12 !py-6 relative" // relativeを追加
    >
      <div className="flex items-center justify-center">
        {/* ★8. ローディング中はスピナーを表示し、テキストを見えなくする★ */}
        
        {/* スピナー: ローディング中のみ表示 */}
        {isLoading && (
          <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin absolute" />
          ログアウト処理中...
          </div>
        )}
        
        {/* テキスト: ローディング中は透明にして、幅を保持する */}
        <span className={isLoading ? "opacity-0" : ""}> 
          ログアウト
        </span>

      </div>
    </Button>
  );
}