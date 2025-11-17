// app/userInsert/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UserInsertPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

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
        setMessage('ユーザー登録が完了しました！');
        router.push('/login'); // ログインページにリダイレクト
      } else {
        setMessage(data.message || 'ユーザー登録に失敗しました。');
      }
    } catch (error) {
      console.error('ユーザー登録中にエラーが発生しました:', error);
      setMessage('サーバーエラーが発生しました。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">新規お客様登録</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">ユーザー名</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">パスワード</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登録
          </Button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}