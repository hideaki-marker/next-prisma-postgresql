// components/common/DeleteReservationButton.tsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // トースト通知ライブラリ (インストール済みと仮定)
import { Trash2 } from 'lucide-react'; // アイコンライブラリ (インストール済みと仮定)
import { Button } from '@/components/ui/button'; // shadcn/uiのButtonコンポーネント (仮定)
import { deleteReservation } from '@/app/reserve/actions'; // 作成したサーバーアクションをインポート

type Props = {
    rsvId: number;
};

export default function DeleteReservationButton({ rsvId }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        // 確認ダイアログ
        if (!window.confirm('本当にこの予約を削除しますか？')) {
            return;
        }

        startTransition(async () => {
            // サーバーアクションを呼び出し
            const result = await deleteReservation(rsvId);

            if (result.success) {
                toast.success(result.message);
                // 削除後、データを再フェッチするためにページをリフレッシュ
                router.refresh(); 
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <Button 
            onClick={handleDelete}
            variant="destructive" // 赤色のボタン
            size="sm"
            className="flex items-center space-x-1"
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
            <span>{isPending ? '削除中...' : '削除'}</span>
        </Button>
    );
}