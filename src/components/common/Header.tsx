import Link from 'next/link';
import { Utensils, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    
    <nav className="bg-white shadow-lg">
      
      <div className="container mx-auto flex items-center justify-between h-full">
        
        {/* レストラン名 (左) */}
        <Link href="/" className="text-4xl font-bold text-gray-800 whitespace-nowrap flex-shrink-0">
          Restaurant italy
        </Link>
        
        {/* flex-grow: 中央のスペースを占有 / mx-auto: 中央寄せを補助 */}
        <div className="flex-grow mx-auto flex justify-center">
        {/* リンク群 (右) */}
        <ul className="flex items-center gap-x-16 list-none justify-center">
              <li>
                <Link 
                  href="/showMenu" 
                  className="flex items-center text-lg text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <Utensils className="h-6 w-6 mr-1" />
                  メニュー紹介
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="flex items-center text-lg text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <LogIn className="h-6 w-6 mr-1" />
                  ログイン
                </Link>
              </li>
              <li>
                <Link 
                  href="/userInsert" 
                  className="flex items-center text-lg text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <UserPlus className="h-6 w-6 mr-1" />
                  新規お客様登録
                </Link>
              </li>
            </ul>
      </div>
      </div>
    </nav>
  );
}