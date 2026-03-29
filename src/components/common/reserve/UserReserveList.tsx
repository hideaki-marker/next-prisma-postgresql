"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { updateReservationStatus } from "@/app/reserve/actions";
import ReturnButton from "../ReturnButton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // ゴミ箱アイコンを入れると可愛いです
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose, // 閉じるボタン用
} from "@/components/ui/dialog";

// 型定義（管理者用と同じものを使用）
type ReservationWithRelations = any;

export default function UserReserveList({
  initialReservations,
}: {
  initialReservations: ReservationWithRelations[];
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // キャンセル処理のみ残す
  const handleCancel = async (rsvId: number) => {
    if (!window.confirm("予約をキャンセルしてもよろしいですか？")) return;

    try {
      const result = await updateReservationStatus(rsvId, "cancelled");

      if (result.success) {
        setReservations((prev) =>
          prev.map((rsv) =>
            rsv.rsv_id === rsvId ? { ...rsv, status: "cancelled" } : rsv,
          ),
        );
      } else {
        alert(result.message || "キャンセルの更新に失敗しました。");
      }
    } catch (error) {
      console.error("キャンセルエラー:", error);
      alert("通信エラーが発生しました。");
    }
  };

  return (
    <div className="w-full flex justify-center py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-4xl w-full px-4">
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
          マイ予約一覧
        </h1>

        {reservations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">現在、予約情報はありません。</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {reservations.map((rsv) => (
              <Card
                key={rsv.rsv_id}
                className="w-full overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow"
              >
                {/* ヘッダー：予約日をメインに表示 */}
                <CardHeader className="bg-gray-800 text-white py-4 px-6 flex flex-row items-center justify-between">
                  <h3 className="text-lg font-bold">
                    {isMounted
                      ? rsv.rsv_date
                        ? format(
                            new Date(rsv.rsv_date),
                            "yyyy年MM月dd日(E) HH:mm",
                            { locale: ja },
                          )
                        : "日時未設定"
                      : "---"}
                  </h3>
                  {/* ステータスバッジ */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rsv.status === "visited"
                        ? "bg-green-500 text-white"
                        : rsv.status === "cancelled"
                          ? "bg-gray-500 text-white"
                          : "bg-yellow-500 text-white"
                    }`}
                  >
                    {rsv.status === "visited"
                      ? "来店済み"
                      : rsv.status === "cancelled"
                        ? "キャンセル"
                        : "予約中"}
                  </span>
                </CardHeader>

                <CardContent className="p-6 text-gray-700 bg-white">
                  <dl className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
                    {/* 人数 */}
                    <div>
                      <dt className="text-xs font-semibold uppercase text-gray-400 mb-1">
                        予約人数
                      </dt>
                      <dd className="text-base font-medium">
                        {rsv.person} 名様
                      </dd>
                    </div>

                    {/* テーブル */}
                    <div>
                      <dt className="text-xs font-semibold uppercase text-gray-400 mb-1">
                        お座席
                      </dt>
                      <dd className="text-base font-medium">
                        {rsv.table_loc?.table_name ?? "未設定"}
                      </dd>
                    </div>

                    {/* 注文内容 */}
                    <div className="md:col-span-1">
                      <dt className="text-xs font-semibold uppercase text-gray-400 mb-1">
                        ご注文内容
                      </dt>
                      <dd className="text-sm font-medium text-blue-700">
                        {rsv.details && rsv.details.length > 0 ? (
                          <ul className="space-y-1">
                            {rsv.details.map((detail: any, idx: number) => (
                              <li key={idx}>
                                {detail.course?.c_name ||
                                  detail.menu?.m_name ||
                                  "不明なメニュー"}
                                {detail.quantity > 1 && ` × ${detail.quantity}`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">詳細なし</span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  {/* アクションエリア：予約中のみキャンセル可能 */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    {rsv.status === "pending" && (
                      <Dialog>
                        {/* 1. トリガー（元のキャンセルボタン） */}
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            この予約をキャンセルする
                          </Button>
                        </DialogTrigger>

                        {/* 2. ダイアログの内容 */}
                        <DialogContent className="sm:max-w-[425px]">
                          {/* Header全体をセンター寄せ */}
                          <DialogHeader className="flex flex-col items-center justify-center text-center">
                            <DialogTitle className="text-red-600 text-xl font-bold">
                              予約のキャンセル確認
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-gray-600">
                              一度キャンセルすると元に戻せません。
                              <br />
                              <span className="text-lg font-semibold text-gray-900 block mt-1">
                                {isMounted &&
                                  format(
                                    new Date(rsv.rsv_date),
                                    "MM月dd日 HH:mm",
                                  )}
                              </span>
                              の予約をキャンセルしてもよろしいですか？
                            </DialogDescription>
                          </DialogHeader>

                          {/* Footerもセンターに寄せてバランスを取る */}
                          <DialogFooter className="flex flex-row justify-center gap-3 pt-6 sm:justify-center">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-32"
                              >
                                戻る
                              </Button>
                            </DialogClose>

                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                className="w-40"
                                onClick={() => handleCancel(rsv.rsv_id)}
                              >
                                キャンセルを確定する
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* 戻るボタン */}
            <div className="flex justify-center mt-10">
              <ReturnButton isLoggedIn={true} returnUrl="/myPage" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
