// app/reserveList/page.tsx
// ★修正: ReservationListResult 型をインポート
import { getReservationList, ReservationWithRelations, ReservationListResult } from '../reserve/actions'; 
import { format } from 'date-fns'; // 日付の整形に便利なライブラリ (インストールが必要です)
import { ja } from 'date-fns/locale'; // 日本語ロケール
import DeleteReservationButton from '@/components/common/DeleteReservationButton';
import { Button } from '@/components/ui/button';

// ★ 注: date-fns のインストールが必要な場合があります
// npm install date-fns

export default async function ReserveListPage() {
    // サーバーコンポーネント内で直接DBからデータを取得
   // ★最終修正: 戻り値の型を一旦 'any' として扱い、その結果を ReservationListResult 型としてアサートします。
    // これにより、TypeScriptの厳密な型推論による undefined の追加を無視できます。
    const result = (await getReservationList() as any) as ReservationListResult;
    // 1. 失敗の場合の明確な処理
    if (!result.success) {
        // エラーが発生した場合はエラーメッセージを表示
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-red-600">
                <h1 className="text-3xl font-bold mb-6">予約一覧</h1>
                <p>データの取得に失敗しました: {result.message}</p>
                <p>詳細なエラー内容はコンソールをご確認ください。</p>
            </div>
        );
    }

    const reservations: ReservationWithRelations[] = result.data || [];

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">予約一覧</h1>
            
            {reservations.length === 0 ? (
                <p className="text-center text-gray-500">現在、予約情報はありません。</p>
            ) : (
                <div className="space-y-6">
                     {/* ★修正：rsv に ReservationWithRelations 型を適用 */}
                    {reservations.map((rsv: ReservationWithRelations) => (
                        <div key={rsv.rsv_id} className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
                            <h2 className="text-2xl font-semibold mb-2">予約ID: {rsv.rsv_id}</h2>
                            <div className="space-y-1 text-gray-700">
                                <p>
                                    <span className="font-medium">予約日時:</span>{' '}
                                    {format(rsv.rsv_date, 'yyyy年MM月dd日(E) HH:mm', { locale: ja })}
                                </p>
                                <p>
                                    <span className="font-medium">予約者:</span>{' '}
                                    {/* ★修正：users に name があることを型が保証します */}
                                    {rsv.users.name} 
                                </p>
                                <p>
                                    <span className="font-medium">人数:</span> {rsv.person} 名
                                </p>
                                <p>
                                    <span className="font-medium">テーブル:</span>{' '}
                                    {/* ★修正：table_loc に table_name と capacity があることを型が保証します */}
                                    {rsv.table_loc.table_name} ({rsv.table_loc.max_capacity}名席)
                                </p>
                                {/* ★★★ 削除ボタンの追加 ★★★ */}
                                <DeleteReservationButton rsvId={rsv.rsv_id} />
                            </div>
                        </div>
                    ))}
                    <a href='/adminIndex'> 
                <div className="flex items-center justify-center mb-16">
                    <Button
                        variant="outline"
                        className="bg-black text-white hover:bg-gray-800 hover:text-white text-2xl !px-12 !py-6"
                    >
                        戻る
                    </Button>
                </ div>
                    </a>
                </div>
            )}
        </div>
    );
}