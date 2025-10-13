import Link from 'next/link';
import { UserCog } from 'lucide-react';

export default function MenuBar() {
  return (
    <>
      {/* メニューバーの高さ分の余白 */}
      <div className="h-16"></div>

      {/* 画面下部に固定されるナビゲーションバー */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
        <ul className="flex justify-end space-x-4">
          <li>
            <Link href="/adminLogin" className="flex items-center text-lg">
              <UserCog className="mr-2 h-6 w-6" />
              管理者ログイン
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}