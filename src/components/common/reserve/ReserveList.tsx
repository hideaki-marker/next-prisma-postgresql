// app/reserveList/ReserveListClient.tsx (クライアントコンポーネント)

'use client'; 

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox'; 
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ★ ReservationWithRelations 型は必要に応じて import/定義してください
type ReservationWithRelations = any; 

// props としてサーバーから渡された初期データを受け取る
export default function ReserveList({ initialReservations }: { initialReservations: ReservationWithRelations[] }) {
    
    // ★★★ useState はここに定義する ★★★
    const [reservations, setReservations] = useState(initialReservations);
    const [selectedReservationIds, setSelectedReservationIds] = useState<number[]>([]);
    
    // ★★★ handleCheckboxChange, handleDeleteSelected 関数もここに定義する ★★★
    const handleCheckboxChange = (rsvId: number, isChecked: boolean) => {
        setSelectedReservationIds(prevIds => {
            if (isChecked) {
                return [...prevIds, rsvId];
            } else {
                return prevIds.filter(id => id !== rsvId);
            }
        });
    };

    const handleDeleteSelected = async () => {
        // ... 削除ロジック（省略） ...
        if (selectedReservationIds.length === 0) return alert('削除する予約を選択してください。');
        if (!confirm(`${selectedReservationIds.length}件の予約を削除してもよろしいですか？\nこの操作は元に戻せません。`)) return;

        try {
            // 仮の成功処理
            alert('選択した予約を削除しました。');
            
            // UIを更新
            setReservations(prevRsvs => prevRsvs.filter(rsv => !selectedReservationIds.includes(rsv.rsv_id)));
            setSelectedReservationIds([]);
            
        } catch (error) {
            console.error('一括削除エラー:', error);
            alert('削除処理中にエラーが発生しました。');
        }
    };
    
    const displayReservations = reservations; // 状態変数を使用

    return (
        <div className="w-full flex justify-center py-12">
            <div className="max-w-5xl w-full px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">予約一覧</h1>
                    <br />
                {displayReservations.length === 0 ? (
                    <p className="text-center text-gray-500">現在、予約情報はありません。</p>
                ) : (
                    <div className="space-y-6">
                        {displayReservations.map((rsv) => (
                            <Card 
                            key={rsv.rsv_id} 
                            // 元のクラスから、hover:shadow-lgだけ残して、Cardの標準デザインを活かす
                            className="w-full hover:shadow-lg transition-shadow" 
                            >
                            {/* CardHeaderで予約IDとチェックボックスを横並びに配置 */}
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                {/* 予約IDを CardHeader の Title の代わりとして強調 */}
                                <h3 className="text-xl font-bold tracking-tight text-gray-800">
                                予約ID: {rsv.rsv_id}
                                </h3>
                                
                                {/* チェックボックスのエリア */}
                                <div>
                                <Checkbox
                                    checked={selectedReservationIds.includes(rsv.rsv_id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(rsv.rsv_id, checked as boolean)}
                                    aria-label={`予約ID ${rsv.rsv_id} を削除対象として選択`}
                                    // 削除対象がわかりやすいように赤を強調するスタイルはそのまま！
                                    className="w-6 h-6 border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                                />
                                </div>
                            </CardHeader>
                            
                            {/* CardContentで予約の詳細情報を定義リスト形式で配置 */}
                            <CardContent className="pt-2 text-gray-700">
                                <dl className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                
                                {/* 予約日時 */}
                                <div className="col-span-2 md:col-span-1"> {/* 日時は少し幅を取る */}
                                    <dt className="text-xs font-semibold uppercase text-gray-500">予約日時</dt>
                                    <dd className="text-sm font-medium">
                                    {format(rsv.rsv_date, 'yyyy年MM月dd日(E) HH:mm', { locale: ja })}
                                    </dd>
                                </div>

                                {/* 予約者 */}
                                <div>
                                    <dt className="text-xs font-semibold uppercase text-gray-500">予約者</dt>
                                    <dd className="text-sm">{rsv.users.name}</dd>
                                </div>

                                {/* 人数 */}
                                <div>
                                    <dt className="text-xs font-semibold uppercase text-gray-500">人数</dt>
                                    <dd className="text-sm">{rsv.person} 名</dd>
                                </div>

                                {/* テーブル */}
                                <div>
                                    <dt className="text-xs font-semibold uppercase text-gray-500">テーブル</dt>
                                    <dd className="text-sm">
                                    {rsv.table_loc.table_name} ({rsv.table_loc.max_capacity}名席)
                                    </dd>
                                </div>
                                </dl>
                            </CardContent>
                            </Card>
                        ))}
                        
                        {/* 一括削除ボタン */}
                        <div className="flex justify-center pt-8">
                            <Button
                                onClick={handleDeleteSelected}
                                disabled={selectedReservationIds.length === 0} 
                                className="bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-4 font-bold transition-all"
                            >
                                選択した予約を削除 ({selectedReservationIds.length})
                            </Button>
                        </div>
                        
                        {/* 戻るボタン */}
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
        </div>
    );
}