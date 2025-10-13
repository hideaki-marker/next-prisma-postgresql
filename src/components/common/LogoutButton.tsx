'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // shadcn/uiのButtonコンポーネントを想定
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // ログアウト成功時にトースト通知を表示
        toast.success('ログアウトしました');
        // 2秒後にホーム画面にリダイレクト
        setTimeout(() => {
          router.push('/home');
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
    <Button onClick={handleLogout}
    variant="outline" 
      className="bg-black text-white hover:bg-gray-800 hover:text-white"
    >
      ログアウト
    </Button>
  );
}