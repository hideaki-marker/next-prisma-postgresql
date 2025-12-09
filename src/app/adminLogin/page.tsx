// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormSubmitButton } from '@/components/common/FormSubmitButton';
import ReturnButton from '@/components/common/ReturnButton';
import { boolean } from 'zod';

type LoginFormData = {
  name: string;
  password: string;
};

export default function AdminLoginPage() {
  // useStateとメッセージはログイン失敗時のために残す
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useFormでフォームの状態を管理
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/adminLogin', {
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
        setMessage('管理者ページにログインに成功しました！');
        setIsLoggedIn(true);
        // クライアント側でリダイレクトする場合
        router.push('/adminIndex');
      } else {
        // ログイン失敗時のエラーメッセージ処理
        const errorData = await response.json();
        setMessage(errorData.message || '管理者ページにログイン失敗しました。');
      }
    } catch (error) {
      console.error('管理者ページログイン中にエラーが発生しました:', error);
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
        <h2>管理者ページログイン</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            id="name"
            {...register('name', { required: true })} // registerのみを使用
            placeholder="管理者名"
            className=""
          /><br />
          <Input
            type="password"
            id="password"
            {...register('password', { required: true })} // registerのみを使用
            placeholder="パスワード"
            className=""
          /><br />
          <FormSubmitButton
            isLoading={isLoading}
            loadingText="ログイン処理中..." // ローディング時のテキストを指定 (省略可)
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            ログイン {/* children が通常時のテキストとして表示されます */}
          </FormSubmitButton>
                    {message && <div style={messageStyle}>{message}</div>}
                  </form>
                  <ReturnButton isLoggedIn={isLoggedIn} />
                </div>
              </div>
            );
          }

// スタイルの定義 (変更なし)

const messageStyle: React.CSSProperties = {
  marginTop: '15px',
  textAlign: 'center',
  color: 'red',
};