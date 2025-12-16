import Link from 'next/link';
import Image from 'next/image';
import { Utensils, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    
    <nav className="
      shadow-md border-b border-gray-200 py-6
      /* 背景画像の設定 */
      bg-[url('/headerbg.jpg')] 
      bg-repeat
      bg-center
      /* ↓ 画像の上にクリーム色を重ねて馴染ませる設定 */
      bg-[#FDFCF0]/90 
      bg-blend-overlay
    ">
      
      <div className="container mx-auto flex items-center justify-between h-full">
        
        {/* レストラン名 (左) */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Image 
                src="/headerlogo.png"          // ★2. 画像のパス (public直下の場合)
                alt="Restaurant Italy"   // 代替テキスト
                width={200}              // ★3. 表示したい幅 (px)
                height={60}              // ★4. 表示したい高さ (px)
                className="object-contain" // アスペクト比を維持
                priority                 // LCP対策（ヘッダー画像なので優先読み込み）
              />
            </Link>
        
        {/* flex-grow: 中央のスペースを占有 / mx-auto: 中央寄せを補助 */}
        <div className="flex-grow mx-auto flex justify-center">
        {/* リンク群 (右) */}
        <ul className="flex items-center gap-x-16 list-none justify-center">
              <li>
                <Link 
                  href="/showMenu" 
                  className="flex items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  <Utensils className="h-6 w-6 mr-1.5 text-[#006432] group-hover:text-[#D32F2F]" />
                  メニュー紹介
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="flex items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  <LogIn className="h-6 w-6 mr-1.5 text-[#006432] group-hover:text-[#D32F2F]" />
                  ログイン
                </Link>
              </li>
              <li>
                <Link 
                  href="/userInsert" 
                  className="flex items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  <UserPlus className="h-6 w-6 mr-1.5 text-[#006432] group-hover:text-[#D32F2F]" />
                  新規お客様登録
                </Link>
              </li>
            </ul>
      </div>
      </div>
    </nav>
  );
}