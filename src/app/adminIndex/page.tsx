import Link from 'next/link';
import { cookies } from 'next/headers'; // App RouterでCookieにアクセスするためのヘルパー
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import LogoutButton from '@/components/common/LogoutButton';

export default async function AdminIndex() {
  let adminName = null;

  // 1. 管理者用のCookieから認証トークンを取得
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_auth_token')?.value;

  console.log('authToken:', authToken);

   // 2. 認証トークンがない場合は、未認証のUIを表示
  if (!authToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">管理者ページ</h1>
        <br />
        <p className="flex items-center text-6xl justify-center mb-16">管理者としてログインしてください</p>
        <br />
        <Link href="/adminLogin" className="flex items-center text-4xl justify-center">
          <p>◆管理者ログイン</p>
        </Link>
      </div>
    );
  }

   // 3. 認証トークンがある場合は、トークンを検証して管理者情報を取得
  try {
    const decodedToken: any = jwt.verify(authToken, process.env.JWT_SECRET as string);
    // JWTペイロードから管理者名を取得
    const admName = decodedToken.name;

      if (!admName) {
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

       // Prismaを使って管理者情報を取得
    const admin = await prisma.admin.findUnique({
  where: {
    // adm_nameはユニークなので単独で検索可能
    adm_name: admName,
  },
  select: {
    adm_name: true,
  }
});

    if (admin) {
      adminName = admin.adm_name;
    } else {
      console.error("管理者が見つかりません:", admName);
    }
  } catch (error) {
    console.error("認証トークンの検証または管理者情報の取得に失敗しました:", error);
    adminName = null;
  }

  // 4. 認証されたユーザー向けのUIを表示
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">管理者ページ</h1>
      <br />
      <p className="flex items-center text-6xl justify-center mb-16">
        {adminName ? `${adminName}様いらっしゃいませ` : 'ゲスト様いらっしゃいませ'}
      </p>
      <br />
      <Link href="/menuInsert" className="flex items-center text-4xl justify-center">
        <p>◆メニュー追加</p>
      </Link>
      <br />
      <Link href="/menuUpdate" className="flex items-center text-4xl justify-center">
        <p>◆メニュー編集</p>
      </Link>
      <br />
      <Link href="/menuDelete" className="flex items-center text-4xl justify-center">
        <p>◆メニュー削除</p>
      </Link>
      <br />
      <Link href="/courseInsert" className="flex items-center text-4xl justify-center">
        <p>◆コース追加</p>
      </Link>
      <br />
      <LogoutButton />
    </div>
  );
}