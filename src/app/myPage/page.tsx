import { cookies } from 'next/headers'; // App RouterでCookieにアクセスするためのヘルパー
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import LogoutButton from '@/components/common/LogoutButton';
import { TransitionButton } from '@/components/common/TransitionButton';
import { PiDevicesDuotone, PiChefHatDuotone } from "react-icons/pi";
import { MdGroupAdd } from "react-icons/md";


export default async function MyPagePage() {

   let userName = null; // デフォルトはnull

  // 1. Cookieから認証トークンなどを取得
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value; // ★JWTトークンが保存されているクッキー名を指定

  //console.log('authToken:', authToken);

   if (!authToken) {
    // 認証トークンがない場合、認証されていないUIを表示して早期リターン
    return (
      <div>
        <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">Restaurant italy</h1>
        <br />
        <p className="flex items-center justify-center mb-8">ようこそ！レストランイタリィへ</p>
        <br />
        <p className="flex items-center text-6xl justify-center mb-16">ゲスト様いらっしゃいませ</p>
        {/* ... その他のリンク ... */}
      </div>
    );
  }

  if (authToken) {
    try {
      // JWTを検証し、ペイロードからユーザーIDを抽出
      const decodedToken: any = jwt.verify(authToken, process.env.JWT_SECRET as string); // ★環境変数からシークレットキーを取得
      const userId = decodedToken.id; // ★ペイロードからユーザーIDを取得

      if (!userId) {
      console.error("JWTにユーザーIDが含まれていません。");
      return (
        <div>
          <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">Restaurant italy</h1>
          <br />
          <p className="flex items-center justify-center mb-8">ようこそ！レストランイタリィへ</p>
          <br />
          <p className="flex items-center text-6xl justify-center mb-16">ゲスト様いらっしゃいませ</p>
          {/* ... その他のリンク ... */}
        </div>
      );
    }

      const user = await prisma.users.findUnique({
        where: {
          id: Number(userId), // ★取得したユーザーIDを使用
        },
        select: {
          name: true,
        }
      });

      if (user) {
        userName = user.name;
      } else {
        console.error("ユーザーが見つかりません:", userId);
      }
    } catch (error) {
      console.error("認証トークンの検証またはユーザー情報の取得に失敗しました:", error);
      userName = null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[url('/guestpage.png')] bg-cover bg-center bg-no-repeat">
      {/* 背景全体を少し暗くして、文字を浮かび上がらせる（オプション） */}
    <div className="relative z-10 flex flex-col items-center justify-center bg-[#1A1A1A]/70 backdrop-blur-lg p-10 md:py-20 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl w-full text-white">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-2 text-[#F3E5AB] drop-shadow-lg tracking-tight">Restaurant italy</h1>
        <div className="h-[1px] w-24 bg-[#8B5E3C] mb-6"></div> {/* 飾り線を入れると引き締まります */}
        <br />
        <p className="text-gray-300 text-md mb-10 tracking-widest uppercase">
          — ようこそ！レストランイタリィへ —
        </p>
        <br />
      <div className="text-center mb-12">
        <p className="text-4xl md:text-5xl font-light leading-snug">{
        /* userName が存在する場合のみ表示 */}
          {userName ? (
            <>
              <span className="font-bold text-white">{userName}</span>
              <span className="text-2xl ml-2 text-gray-400">様</span>
              <br />
              <span className="text-3xl text-gray-300">いらっしゃいませ</span>
            </>
          ) : (
            'ゲスト様 いらっしゃいませ'
          )}
        </p>
      </div>
        <br />
      <div className="flex flex-col gap-5 w-full items-center">
        <TransitionButton 
          href="/showMenu" // 遷移先を指定
          variant="ghost"      // スタイルを調整
          className="flex items-center text-3xl justify-center w-full max-w-xs py-6
             text-[#F3E5AB] border border-[#F3E5AB]/30 rounded-full transition-all duration-300
             hover:bg-white/10
             hover:border-[#F3E5AB]
             hover:text-[#E5E7EB]
             hover:shadow-[0_0_15px_rgba(243,229,171,0.3)]
             hover:scale-[1.02] 
             active:scale-[0.98]
             " // 必要に応じてカスタムクラスを追加
        >
        <PiChefHatDuotone className="inline mr-2 !h-9 !w-9 group-hover:text-[#E5E7EB]"/>
          メニュー紹介
        </TransitionButton>
        <br />
        <TransitionButton 
          href="/reserveList" 
          variant="ghost"
          className="flex items-center text-3xl justify-center w-full max-w-xs py-6
             text-[#F3E5AB] border border-[#F3E5AB]/30 rounded-full transition-all duration-300
             hover:bg-white/10
             hover:border-[#F3E5AB]
             hover:text-[#E5E7EB]
             hover:shadow-[0_0_15px_rgba(243,229,171,0.3)]
             hover:scale-[1.02] 
             active:scale-[0.98]"
        >
        <PiDevicesDuotone className="inline mr-2 !h-9 !w-9 group-hover:text-[#E5E7EB]"/>
          ご予約一覧
        </TransitionButton>
        <br />
        <TransitionButton 
          href="/userInsert" 
          variant="ghost"
          className="flex items-center text-3xl justify-center w-full max-w-xs py-6
             text-[#F3E5AB] border border-[#F3E5AB]/30 rounded-full transition-all duration-300
             hover:bg-white/10
             hover:border-[#F3E5AB]
             hover:text-[#E5E7EB]
             hover:shadow-[0_0_15px_rgba(243,229,171,0.3)]
             hover:scale-[1.02] 
             active:scale-[0.98]" // 必要に応じてカスタムクラスを追加
        >
        <MdGroupAdd className="inline mr-2 !h-9 !w-9 group-hover:text-[#E5E7EB]"/>
            友だち追加
        </TransitionButton>
        <br />
        <LogoutButton />
        </div>
      </div>
    </div>
  );
}