"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  deleteReservation,
  updateReservationStatus,
} from "@/app/reserve/actions";
import ReturnButton from "../ReturnButton";

// ★ ReservationWithRelations 型は必要に応じて import/定義してください
type ReservationWithRelations = any;

// props としてサーバーから渡された初期データを受け取る
export default function ReserveList({
  initialReservations,
}: {
  initialReservations: ReservationWithRelations[];
}) {
  // ★★★ useState はここに定義する ★★★
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedReservationIds, setSelectedReservationIds] = useState<
    number[]
  >([]);

  // ★★★ ここにマウント状態を管理するステートを追加 ★★★
  const [isMounted, setIsMounted] = useState(false);

  // マウント時に true に変更する
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ★★★ handleCheckboxChange, handleDeleteSelected 関数もここに定義する ★★★
  const handleCheckboxChange = (rsvId: number, isChecked: boolean) => {
    setSelectedReservationIds((prevIds) => {
      if (isChecked) {
        return [...prevIds, rsvId];
      } else {
        return prevIds.filter((id) => id !== rsvId);
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (
      !window.confirm(
        `${selectedReservationIds.length}件の予約を削除してよろしいですか？`,
      )
    )
      return;

    try {
      // 全ての結果が出るまで待つ (成功も失敗も受け止める)
      const results = await Promise.allSettled(
        selectedReservationIds.map(async (id) => {
          const result = await deleteReservation(id);
          if (!result.success) throw new Error(`ID: ${id} の削除失敗`);
          return id;
        }),
      );

      // 成功したIDだけを抽出
      const deletedIds = results
        .filter(
          (r): r is PromiseFulfilledResult<number> => r.status === "fulfilled",
        )
        .map((r) => r.value);

      // 失敗した数をカウント
      const failedCount = results.filter((r) => r.status === "rejected").length;

      // 成功した分だけ画面から消す
      setReservations((prev) =>
        prev.filter((rsv) => !deletedIds.includes(rsv.rsv_id)),
      );

      // 選択状態も、消えた分だけ解除する
      setSelectedReservationIds((prev) =>
        prev.filter((id) => !deletedIds.includes(id)),
      );

      // 完了報告
      if (failedCount > 0) {
        alert(
          `${deletedIds.length}件削除しました。${failedCount}件の削除に失敗しました。再度お試しください。`,
        );
      } else {
        alert("選択されたすべての予約を削除しました。");
      }
    } catch (error) {
      console.error("一括削除処理中にエラー:", error);
      alert("予期せぬエラーが発生しました。");
    }
  };

  const handleUpdateStatus = async (rsvId: number, newStatus: string) => {
    try {
      // サーバーの関数を呼び出し
      const result = await updateReservationStatus(rsvId, newStatus);

      if (result.success) {
        // 画面上の状態も更新して、リロードなしで色を変える
        setReservations((prev) =>
          prev.map((rsv) =>
            rsv.rsv_id === rsvId ? { ...rsv, status: newStatus } : rsv,
          ),
        );
      } else {
        // サーバー側が「失敗」を返した場合（バリデーションエラーなど）
        alert(result.message || "ステータスの更新に失敗しました。");
      }
    } catch (error) {
      // 通信エラーや予期せぬクラッシュが起きた場合
      console.error("ステータス更新エラー:", error);
      alert("通信エラーが発生しました。時間を置いて再度お試しください。");
    }
  };

  const displayReservations = reservations; // 状態変数を使用

  return (
    <div className="w-full flex justify-center py-12">
      <div className="max-w-5xl w-full px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">予約一覧</h1>
        <br />
        {displayReservations.length === 0 ? (
          <p className="text-center text-gray-500">
            現在、予約情報はありません。
          </p>
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
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(rsv.rsv_id, checked as boolean)
                      }
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
                    <div className="col-span-2 md:col-span-1">
                      {" "}
                      {/* 日時は少し幅を取る */}
                      <dt className="text-xs font-semibold uppercase text-gray-500">
                        予約日時
                      </dt>
                      <dd className="text-sm font-medium">
                        {isMounted
                          ? // ブラウザ側で実行される表示
                            (() => {
                              const date = rsv.rsv_date
                                ? new Date(rsv.rsv_date)
                                : null;
                              if (!date || isNaN(date.getTime())) {
                                return "日時未設定";
                              }
                              return format(date, "yyyy年MM月dd日(E) HH:mm", {
                                locale: ja,
                              });
                            })()
                          : // サーバーレンダリング時（ブラウザで読み込まれる瞬間まで）の表示
                            "---"}
                      </dd>
                    </div>

                    {/* 予約者 */}
                    <div>
                      <dt className="text-xs font-semibold uppercase text-gray-500">
                        予約者
                      </dt>
                      <dd className="text-sm">
                        {rsv.users?.name ?? "退会済みユーザー"}
                      </dd>{" "}
                    </div>

                    {/* 人数 */}
                    <div>
                      <dt className="text-xs font-semibold uppercase text-gray-500">
                        人数
                      </dt>
                      <dd className="text-sm">{rsv.person} 名</dd>
                    </div>

                    {/* テーブル */}
                    <div>
                      <dt className="text-xs font-semibold uppercase text-gray-500">
                        テーブル
                      </dt>
                      <dd className="text-sm">
                        {rsv.table_loc?.table_name ?? "テーブル未設定"}(
                        {rsv.table_loc?.max_capacity ?? "-"}名)
                      </dd>
                    </div>
                    {/* 注文内容（メニュー/コース名） */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1 border-t md:border-t-0 pt-2 md:pt-0">
                      <dt className="text-xs font-semibold uppercase text-gray-500">
                        注文内容
                      </dt>
                      <dd className="text-sm font-medium text-blue-700">
                        {rsv.details && rsv.details.length > 0 ? (
                          <ul className="list-none p-0">
                            {rsv.details.map((detail: any, idx: number) => (
                              <li key={idx}>
                                {/* コース名があればそれを、なければメニュー名を表示 */}
                                {detail.course?.c_name ||
                                  detail.menu?.m_name ||
                                  "不明なメニュー"}
                                {detail.quantity > 1 && (
                                  <span className="text-gray-500 ml-1">
                                    × {detail.quantity}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">詳細なし</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex items-center gap-3">
                    {/* ステータスバッジ */}
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        rsv.status === "visited"
                          ? "bg-green-500 text-white"
                          : rsv.status === "cancelled"
                            ? "bg-gray-400 text-white"
                            : "bg-yellow-500 text-white"
                      }`}
                    >
                      {rsv.status === "visited"
                        ? "来店済み"
                        : rsv.status === "cancelled"
                          ? "キャンセル"
                          : "予約中"}
                    </span>
                  </div>

                  {/* ボタンエリア */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleUpdateStatus(rsv.rsv_id, "visited")}
                      disabled={rsv.status === "visited"}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      来店完了
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(rsv.rsv_id, "cancelled")
                      }
                      disabled={rsv.status === "cancelled"}
                      className="border border-red-500 text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      キャンセル
                    </button>
                  </div>
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
            <ReturnButton isLoggedIn={true} returnUrl="/adminIndex" />
          </div>
        )}
      </div>
    </div>
  );
}
