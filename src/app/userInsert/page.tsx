'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 新規お客様登録ページコンポーネント
 * @description shadcn/uiのCardを使用し、縦長で視認性の高いフォームを提供します。
 */
export default function UserInsertPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // ログイン画面への遷移用

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('ユーザー登録が完了しました！');
        router.push('/login'); // ログインページにリダイレクト
      } else {
        toast.error('ユーザー登録に失敗しました。');
      }
    } catch (error) {
      toast.error('サーバーエラーが発生しました。');
      console.error('ユーザー登録中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ログイン画面へ遷移する関数
  const handleGoToLogin = () => {
    setIsNavigating(true);
    router.push('/login');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 bg-[url('/NewCustomerRegistration.png')] bg-cover bg-center">
      <Card className="w-full max-w-[450px] shadow-xl border-none overflow-hidden">
        {/* ヘッダー部：メニュー更新画面と統一感のある色使い */}
        <CardHeader className="bg-black text-white py-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white/10 rounded-full">
              <UserPlus className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              新規お客様登録
            </CardTitle>
            <p className="text-white/70 text-sm">情報を入力してアカウントを作成してください</p>
          </div>
        </CardHeader>

        <CardContent className="pt-10 px-8">
          <form id="user-insert-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-600 ml-1">
                ユーザー名
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="名前を入力してください"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 border-gray-200 focus:ring-[#4A2C2A] focus:border-[#4A2C2A]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-600 ml-1">
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-200 focus:ring-[#4A2C2A] focus:border-[#4A2C2A]"
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="pb-10 px-8 flex flex-col space-y-4">
          <Button
            form="user-insert-form"
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-black hover:opacity-80 text-white h-12 text-lg font-bold transition-all shadow-md"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'アカウントを登録する'
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-gray-500 hover:text-[#4A2C2A] w-full" 
            onClick={handleGoToLogin}
            disabled={isLoading || isNavigating} // 何か処理中は二重クリック防止
          >
            {isNavigating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                読み込み中...
              </>
            ) : (
              'すでにアカウントをお持ちの方はこちら'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}