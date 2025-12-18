import Link from 'next/link';
import Image from 'next/image';
import { Utensils, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    
    <nav className="
      shadow-md border-b border-gray-200 py-6
      py-18
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
                width={240}              // ★3. 表示したい幅 (px)
                height={60}              // ★4. 表示したい高さ (px)
                className="object-contain" // アスペクト比を維持
                priority                 // LCP対策（ヘッダー画像なので優先読み込み）
              />
            </Link>

            {/* 中央：サイゼリヤ特有の赤いキャッチフレーズ */}
        <div className="hidden lg:flex flex-grow justify-center items-center text-center">
          <p className="text-[#D32F2F] italic font-serif text-xl font-bold tracking-widest">
            La Buona Tavola! <span className="text-sm font-sans ml-2">楽しい食卓</span>
          </p>
        </div>
        
        {/* flex-grow: 中央のスペースを占有 / mx-auto: 中央寄せを補助 */}
        <div className="flex-grow mx-auto flex justify-center">
        {/* リンク群 (右) */}
        <ul className="flex items-center gap-x-16 list-none justify-center">
              <li>
                <Link 
                  href="/showMenu" 
                  className="group flex flex-col items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  {/* 日本語とアイコンの行 */}
                <div className="flex items-center text-xl font-bold !text-[#006432] group-hover:!text-[#D32F2F] transition-colors">
                  <Utensils className="h-6 w-6 mr-1.5" />
                  <span>メニュー紹介</span>
                </div>
                {/* 英語サブテキスト：真下に配置 */}
                <span className="text-[11px] text-gray-500 font-serif italic mt-0.5 group-hover:!text-[#D32F2F]">
                  Menu book
                </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="group flex flex-col items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  <div className="flex items-center text-xl font-bold !text-[#006432] group-hover:!text-[#D32F2F] transition-colors">
                  <LogIn className="h-6 w-6 mr-1.5" />
                  <span>ログイン</span>
                </div>
                <span className="text-[11px] text-gray-500 font-serif italic mt-0.5 group-hover:!text-[#D32F2F]">
                  Sign in
                </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/userInsert" 
                  className="group flex flex-col items-center text-lg !text-[#006432] hover:!text-[#D32F2F] whitespace-nowrap"
                >
                  <div className="flex items-center text-xl font-bold !text-[#006432] group-hover:!text-[#D32F2F] transition-colors">
                    <UserPlus className="h-6 w-6 mr-1.5" />
                  <span>新規お客様登録</span>
                </div>
                <span className="text-[11px] text-gray-500 font-serif italic mt-0.5 group-hover:!text-[#D32F2F]">
                  New Registration
                </span>
                </Link>
              </li>
            </ul>
      </div>
      </div>
    </nav>
  );
}