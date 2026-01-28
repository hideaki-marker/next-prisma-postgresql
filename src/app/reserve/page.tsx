import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// ユーザー情報をトークンから取得する関数 (仮定)
// import { getUserIdFromAuthToken } from '@/lib/auth';
import ReserveForm from "@/components/common/ReserveForm"; // 次に作成する予約フォームコンポーネント
// ★修正: サーバーアクションからテーブル取得関数をインポート
import { getAllTableLocs } from "./actions";
import { TableLoc } from "@/type/db";

/**
 * 予約入力ページ
 * * クッキーから認証トークンを確認し、未認証の場合はログインページへリダイレクトします。
 * データベースから予約可能なテーブル情報を取得し、予約フォームへと渡します。
 * 背景画像に '/reserve.png' を使用した、没入感のあるフルスクリーンレイアウトを提供します。
 * * @async
 * @function ReservePage
 * @returns {Promise<JSX.Element>} 認証チェック済みの予約入力画面
 * * @example
 * // 内部フロー:
 * // 1. Cookieから 'auth_token' を取得
 * // 2. トークンがない場合は /login へリダイレクト
 * // 3. ユーザーIDを特定 (現在は仮ID: 1)
 * // 4. DBから TableLoc[] (テーブル情報) を取得
 * // 5. ReserveForm コンポーネントにデータを渡してレンダリング
 */
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
