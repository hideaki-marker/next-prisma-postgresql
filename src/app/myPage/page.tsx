import { cookies } from 'next/headers'; // App RouterでCookieにアクセスするためのヘルパー
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import LogoutButton from '@/components/common/LogoutButton';
import { TransitionButton } from '@/components/common/TransitionButton';
import { PiDevicesDuotone } from "react-icons/pi";
import { MdGroupAdd } from "react-icons/md";


export default async function MyPagePage() {
  

   let userName = null; // デフォルトはnull

  // 1. Cookieから認証トークンなどを取得
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value; // ★JWTトークンが保存されているクッキー名を指定

  console.log('authToken:', authToken);

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
      <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">Restaurant italy</h1>
      <br />
      <p className="flex items-center justify-center mb-8">ようこそ！レストランイタリィへ</p>
      <br />
      <p className="flex items-center text-6xl justify-center mb-16">{
      /* userName が存在する場合のみ表示 */}
        {userName ? `${userName}様いらっしゃいませ` : 'ゲスト様いらっしゃいませ'}</p>
      <br />
      <TransitionButton 
        href="/showMenu" // 遷移先を指定
        variant="outline"      // スタイルを調整
        className="flex items-center text-4xl justify-center" // 必要に応じてカスタムクラスを追加
      >
      <p>◆メニュー紹介</p>
      </TransitionButton>
      <br />
       <TransitionButton 
        href="/reserveList" 
        variant="outline"
        className="flex items-center text-4xl justify-center" // 必要に応じてカスタムクラスを追加
      >
      <PiDevicesDuotone className="inline mr-2 !h-9 !w-9"/>
        ご予約一覧
      </TransitionButton>
      <br />
      <TransitionButton 
        href="/userInsert" 
        variant="outline"
        className="flex items-center text-4xl justify-center" // 必要に応じてカスタムクラスを追加
      >
      <MdGroupAdd className="inline mr-2 !h-9 !w-9"/>
          友だち追加
      </TransitionButton>
      <br />
      <LogoutButton />
    </div>
  );
}