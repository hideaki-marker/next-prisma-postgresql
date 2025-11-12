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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>ログイン</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            id="name"
            {...register('name', { required: true })} // register はそのまま利用可能
            placeholder="ユーザー名"
            // 元の className は Input コンポーネントのデフォルトスタイルで置き換えられます。
            // 必要に応じて className="mb-4" のようにマージンのみ残すこともできます。
            className="mb-4" 
          />
          <Input
            type="password"
            id="password"
            {...register('password', { required: true })} // register はそのまま利用可能
            placeholder="パスワード"
            // className="mb-4" のみ残す
            className="mb-4"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="!block !w-3/5 !mx-auto p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold border-none rounded-md cursor-pointer text-base"
          >
              {isLoading ? (
            <div className="flex items-center justify-center">
                {/* Loader2アイコンにアニメーション（spin）を設定 */}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン処理中...
            </div>
            ) : (
                // 通常時のボタンテキスト
                'ログイン'
            )}
          </Button>
          {message && <div className="mt-4 text-center text-red-600">{message}</div>}
        </form>
      </div>
    </div>
  );
}