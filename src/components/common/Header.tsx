import Link from 'next/link';
import { Utensils, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg h-16">
      <div className="container mx-auto flex items-center justify-between h-full">
        {/* レストラン名を左寄せに */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Restaurant italy
        </Link>
        
        {/* リンク群を中央に配置するコンテナ */}
        <div className="flex-1 flex justify-center items-center flex-1">
          <ul className="flex items-center space-x-12 mx-auto">
            <li>
              <Link href="/showMenu" className="flex items-center text-gray-600 hover:text-gray-900">
                <Utensils className="h-5 w-5 mr-1" />
                メニュー紹介
              </Link>
            </li>
            <li>
              <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                <LogIn className="h-5 w-5 mr-1" />
                ログイン
              </Link>
            </li>
            <li>
              <Link href="/userInsert" className="flex items-center text-gray-600 hover:text-gray-900">
                <UserPlus className="h-5 w-5 mr-1" />
                新規お客様登録
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}