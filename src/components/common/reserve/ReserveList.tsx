// app/reserveList/ReserveListClient.tsx (クライアントコンポーネント)

'use client'; 

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox'; 
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

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
            
                {displayReservations.length === 0 ? (
                    <p className="text-center text-gray-500">現在、予約情報はありません。</p>
                ) : (
                    <div className="space-y-6">
                        {displayReservations.map((rsv) => (
                            // ... (JSXの本体は元のコードから全てコピー) ...
                            <div 
                                key={rsv.rsv_id} 
                                className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow flex items-start justify-between"
                            >
                                {/* 予約情報本体 */}
                                <div className="space-y-1 text-gray-700 flex-grow pr-4"> 
                                    <h2 className="text-2xl font-semibold mb-2">予約ID: {rsv.rsv_id}</h2>
                                    <p>
                                        <span className="font-medium">予約日時:</span>{' '}
                                        {format(rsv.rsv_date, 'yyyy年MM月dd日(E) HH:mm', { locale: ja })}
                                    </p>
                                    <p><span className="font-medium">予約者:</span> {rsv.users.name}</p>
                                    <p><span className="font-medium">人数:</span> {rsv.person} 名</p>
                                    <p><span className="font-medium">テーブル:</span> {rsv.table_loc.table_name} ({rsv.table_loc.max_capacity}名席)</p>
                                </div>
                                {/* チェックボックス */}
                                <div className="pt-2"> 
                                    <Checkbox
                                        checked={selectedReservationIds.includes(rsv.rsv_id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(rsv.rsv_id, checked as boolean)}
                                        aria-label={`予約ID ${rsv.rsv_id} を削除対象として選択`}
                                        className="w-6 h-6 border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                                    />
                                </div>
                            </div>
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