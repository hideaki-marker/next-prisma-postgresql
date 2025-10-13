import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// ユーザー情報をトークンから取得する関数 (仮定)
// import { getUserIdFromAuthToken } from '@/lib/auth'; 
import ReserveForm from '@/components/common/ReserveForm'; // 次に作成する予約フォームコンポーネント
// ★修正: サーバーアクションからテーブル取得関数をインポート
import { getAllTableLocs, TableLoc } from './actions'; 

export default async function ReservePage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    // 1. 認証チェック
    if (!authToken) {
        // ログインしていない場合はログインページへリダイレクト
        redirect('/login'); 
    }
    
    // 2. 認証トークンからユーザーIDを取得 (実際の実装に合わせる)
    // ここでは仮に '1' としますが、実際はトークンをデコードして取得してください。
    // const userId = await getUserIdFromAuthToken(authToken); 
    const userId = 1; // 開発用仮ID

    // ★修正: データベースからテーブルデータを取得
    const tableData: TableLoc[] = await getAllTableLocs();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">ご予約情報の入力</h1>
            
             {/* ★修正: 取得したテーブルデータを props として ReserveForm に渡す */}
            <ReserveForm userId={userId} tableData={tableData} />
        </div>
    );
}