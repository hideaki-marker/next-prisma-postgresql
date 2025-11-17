// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// ★★★ ローディングアイコンをインポート ★★★
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react"; // エラー時に使うアイコン

type LoginFormData = {
  name: string;
  password: string;
};

export default function LoginPage() {
  // useStateとメッセージはログイン失敗時のために残す
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useFormでフォームの状態を管理
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
        // 処理開始: ローディングを true に設定
        setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // ★この行を追加
      });

      if (response.redirected) {
        // API側でリダイレクトが成功した場合、クライアント側では何もしない
      } else if (response.ok) {
        // ログイン成功時のメッセージを表示
        setMessage('ログインに成功しました！');
        // クライアント側でリダイレクトする場合
        router.push('/myPage');
      } else {
        // ログイン失敗時のエラーメッセージ処理
        const errorData = await response.json();
        setMessage(errorData.message || 'ログインに失敗しました。');
      }
    } catch (error) {
      console.error('ログイン中にエラーが発生しました:', error);
        setMessage('サーバーエラーが発生しました。');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50"> 
  
      {/* 元のフォームを囲む div を Card コンポーネントに置き換える！ */}
      <Card className="w-full max-w-sm">
        
        {/* CardHeaderでタイトル（h2）を配置 */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            🔐 ログイン
          </CardTitle>
        </CardHeader>
        
        {/* CardContentでフォームの中身を配置 */}
        <CardContent>
          {/* フォームはそのまま残す */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ユーザー名入力 */}
            <div className="grid gap-4"> {/* 入力フィールド間のスペースを統一 */}
              <Input
                type="text"
                id="name"
                {...register('name', { required: true })}
                placeholder="ユーザー名"
                // shadcn の Input はデフォルトで十分なスタイルを持ってるから、classNameは不要
              />
            
              {/* パスワード入力 */}
              <Input
                type="password"
                id="password"
                {...register('password', { required: true })}
                placeholder="パスワード"
              />
            </div>
            
            {/* ログインメッセージ (エラーメッセージなど) */}
              {message && (
                <Alert variant="destructive" className="mt-4"> 
                  {/* エラーアイコン */}
                  <AlertCircle className="h-4 w-4" /> 
                  
                  {/* メッセージのタイトル（ここでは「エラー」と固定） */}
                  <AlertTitle>ログインエラー</AlertTitle> 
                  
                  {/* メッセージ本文 */}
                  <AlertDescription>
                    {message} 
                  </AlertDescription>
                </Alert>
              )}
            {/* ボタンは CardFooter に移動する方がデザイン的に統一感が出るけど、
              ここではフォームの直下に残すパターンで、スタイルをshadcn/uiに合わせるね！ */}
            <Button
              type="submit"
              disabled={isLoading}
              // shadcn の Button の基本スタイルを活かしつつ、幅を full に変更
              className="w-full mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン処理中...
                </div>
              ) : (
                'ログイン'
              )}
            </Button>
          </form>
        </CardContent>
        
      </Card>
    </div>
  );
}