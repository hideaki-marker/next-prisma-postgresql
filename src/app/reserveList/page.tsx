import {
  getReservationList,
  ReservationWithRelations,
  ReservationListResult,
} from "../reserve/actions";
import ReserveList from "@/components/common/reserve/ReserveList";

// ★★★ async function はここに残す ★★★
export default async function ReserveListPage() {
  // サーバーサイドでデータ取得（ await が許可される）
  const result = (await getReservationList()) as any as ReservationListResult;

  // 1. 失敗の場合の処理
  if (!result.success) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-red-600">
        <h1 className="text-3xl font-bold mb-6">予約一覧</h1>
        <p>データの取得に失敗しました: {result.message}</p>
      </div>
    );
  }

  const reservations: ReservationWithRelations[] = result.data || [];

  // ★★★ クライアントコンポーネントにデータを渡す ★★★
  return <ReserveList initialReservations={reservations} />;
}
