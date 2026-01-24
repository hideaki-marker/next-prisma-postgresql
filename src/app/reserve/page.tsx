import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// ユーザー情報をトークンから取得する関数 (仮定)
// import { getUserIdFromAuthToken } from '@/lib/auth';
import ReserveForm from "@/components/common/ReserveForm"; // 次に作成する予約フォームコンポーネント
// ★修正: サーバーアクションからテーブル取得関数をインポート
import { getAllTableLocs } from "./actions";
import { TableLoc } from "@/type/db";

export default async function ReservePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // 1. 認証チェック
  if (!authToken) {
    // ログインしていない場合はログインページへリダイレクト
    redirect("/login");
  }

  // 2. 認証トークンからユーザーIDを取得 (実際の実装に合わせる)
  // ここでは仮に '1' としますが、実際はトークンをデコードして取得してください。
  // const userId = await getUserIdFromAuthToken(authToken);
  const userId = 1; // 開発用仮ID

  // ★修正: データベースからテーブルデータを取得
  const tableData: TableLoc[] = await getAllTableLocs();

  return (
    <div className="flex flex-col items-center min-h-screen bg-[url('/reserve.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* 1. タイトルを消して「空白」にするためのスペーサー */}
      <div className="h-24 w-full" />

      <div className="w-full max-w-xl px-4 flex flex-col items-center pb-8">
        {/* ↑ pb-8 にして下側の余白を少し詰めました */}

        {/* 2. フォームコンポーネントを囲む div で高さを出す */}
        <div className="w-full min-h-[700px] flex flex-col shadow-xl">
          <ReserveForm userId={userId} tableData={tableData} />
        </div>
      </div>
    </div>
  );
}
