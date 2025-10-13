'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createReservation } from '@/app/reserve/actions';

type OrderItem = {
    m_id: number;
    quantity: number;
};

// 予約ページへ遷移する際に使用する一時保存キー
const RESERVATION_ORDER_KEY = 'temp_reservation_order';

export type TableLoc = {
    table_id: number;
    table_name: string | null;
    max_capacity: number;
};

// ReserveFormProps の型定義
type ReserveFormProps = {
    userId: number;
    tableData: TableLoc[];
    // 実際にはテーブル情報もここで渡すか、アクション内でDBから取得します
    // tables: { table_id: number, table_name: string | null }[]; 
};

export default function ReserveForm({ userId, tableData }: ReserveFormProps) {
    const [person, setPerson] = useState(1);
    const router = useRouter();

    // 注文データ（localStorageから読み込む）
    // NOTE: クライアント側でLocalStorageを扱うため useEffect を使用するのが一般的ですが、
    // ここでは簡略化のため、フォーム送信時に再確認する設計とします。

    // サーバーアクションを呼び出す処理
    const handleSubmit = async (formData: FormData) => {
        // 1. 注文データを取得
        const orderDataJson = localStorage.getItem(RESERVATION_ORDER_KEY);
        if (!orderDataJson) {
            toast.error('メニュー注文情報が見つかりません。');
            return;
        }
        const orderData: OrderItem[] = JSON.parse(orderDataJson);

        // 2. フォームデータを取得
        const rsv_date = formData.get('rsv_date') as string;
        const personStr = formData.get('person') as string;
        const table_id_str = formData.get('table_id') as string;

        // 3. データ形式の検証と変換
        const personCount = parseInt(personStr);
        const tableId = parseInt(table_id_str);

        if (!rsv_date || personCount <= 0 || !tableId) {
            toast.error('予約情報に不足があります。');
            return;
        }

        // フォーム送信ハンドラのロジックを修正
       // ★修正: ここに以前の clientAction のバリデーションロジックを統合します
        const selectedTable = tableData.find(t => t.table_id === tableId);
        if (!selectedTable) {
            toast.error('テーブルの選択が不正です。');
            return;
        }

            // 1. 選択されたテーブルの最大収容人数を取得 (tableDataを使用)
           

            if (!selectedTable) {
                toast.error('テーブルの選択が不正です。');
                return;
            }

            // 2. 人数バリデーションロジック
            const minCapacity = 1;
            const maxCapacity = selectedTable.max_capacity;

            if (personCount < minCapacity || personCount > maxCapacity) {
                toast.error(`人数に不備があります。${selectedTable.table_name} (${maxCapacity}人席) は、${minCapacity}人から${maxCapacity}人まで予約可能です。`);
                return;
            }

            const data = {
                userId,
                rsv_date: new Date(rsv_date),
                person: personCount,
                table_id: tableId,
                orderData: orderData, // 注文データも渡す
            };

            // 4. サーバーアクションを呼び出し、DBに登録
            const result = await createReservation(data);

            if (result.success) {
                // 成功したらLocalStorageをクリアし、完了ページへリダイレクト
                localStorage.removeItem(RESERVATION_ORDER_KEY);
                toast.success('予約が完了しました！');
                router.push('/reserveList');
            } else {
                toast.error(result.message || '予約登録中にエラーが発生しました。');
            }
        };


        return (
            // actionにはサーバーアクションを指定する (今回は handleSubmit 内で呼び出し)
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">予約詳細</h2>

                {/* 予約日時 */}
                <div>
                    <label htmlFor="rsv_date" className="block text-sm font-medium text-gray-700 mb-1">予約日時</label>
                    {/* HTMLの datetime-local を使用して日時入力を簡素化 */}
                    <Input type="datetime-local" id="rsv_date" name="rsv_date" required />
                </div>

                {/* 予約人数 */}
                <div>
                    <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-1">予約人数</label>
                    <Input
                        type="number"
                        id="person"
                        name="person"
                        min="1"
                        value={person}
                        onChange={(e) => setPerson(parseInt(e.target.value) || 1)}
                        required
                    />
                </div>

                {/* テーブル選択 (★実際はDBから取得したテーブル一覧で置き換えてください) */}
                <div>
                    <label htmlFor="table_id" className="block text-sm font-medium text-gray-700 mb-1">テーブル</label>
                    <Select name="table_id" required>
                        <SelectTrigger>
                            <SelectValue placeholder="テーブルを選択" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* ★修正: propsで受け取った tableData を使用して動的に生成 */}
                            {tableData.map(table => (
                                <SelectItem
                                    key={table.table_id}
                                    value={String(table.table_id)}
                                >
                                    {table.table_name} ({table.max_capacity}人席)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3">
                    予約を確定する
                </Button>
            </form>
        );
    }