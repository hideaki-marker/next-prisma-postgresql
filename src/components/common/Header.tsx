import Link from 'next/link';
import { Utensils, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    
    <nav className="bg-white shadow-lg">
      
      <div className="container mx-auto flex items-center justify-between h-full">
        
        {/* レストラン名 (左) */}
        <Link href="/" className="text-2xl font-bold text-gray-800 whitespace-nowrap flex-shrink-0">
          Restaurant italy
        </Link>
        
        {/* リンク群 (右) */}
        <ul className="flex items-center space-x-6 list-none flex-shrink-0">
          <li>
            <Link href="/showMenu" className="flex items-center text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <Utensils className="h-5 w-5 mr-1" />
              メニュー紹介
            </Link>
          </li>
          <li>
            <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <LogIn className="h-5 w-5 mr-1" />
              ログイン
            </Link>
          </li>
          <li>
            <Link href="/userInsert" className="flex items-center text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <UserPlus className="h-5 w-5 mr-1" />
              新規お客様登録
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}