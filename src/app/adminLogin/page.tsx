// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormSubmitButton } from '@/components/common/FormSubmitButton';
import ReturnButton from '@/components/common/ReturnButton';
import {
  Card,
  CardContent,
  CardDescription, // 必要に応じて
  CardFooter,      // 必要に応じて
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type LoginFormData = {
  name: string;
  password: string;
};

export default function AdminLoginPage() {
  // useStateとメッセージはログイン失敗時のために残す
  const [message, setMessage] = useState('');
  const router = useRouter();

  // useFormでフォームの状態を管理
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
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
      <Card className="w-[350px] mx-auto"> {/* w-[350px] は、適切な最大幅を設定する例です */}
        <CardHeader className="pt-6 pb-2"> {/* 上部のパディングを調整 */}
          <CardTitle className="text-2xl font-bold text-center">
            管理者ページログイン
          </CardTitle>
          <CardDescription>ログイン情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
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
              className="bg-green-700 hover:bg-green-800 text-white text-2xl"
            >
              ログイン {/* children が通常時のテキストとして表示されます */}
            </FormSubmitButton>
              {message && <div style={messageStyle}>{message}</div>}
            </form>
          </CardContent>
              <CardFooter className="pt-4 flex justify-center">
                <ReturnButton isLoggedIn={isLoggedIn} />
              </CardFooter>
            </Card>
          </div>
        );
      }

// スタイルの定義 (変更なし)
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
};

const messageStyle: React.CSSProperties = {
  marginTop: '15px',
  textAlign: 'center',
  color: 'red',
};