"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createReservation } from "@/app/reserve/actions";
import { TableLoc } from "@/type/db";
import ReturnButton from "./ReturnButton";

type ReserveFormProps = {
  userId: number;
  tableData: TableLoc[];
};

export default function ReserveForm({ userId, tableData }: ReserveFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [person, setPerson] = useState(1);
  const [orderSummary, setOrderSummary] = useState<string>(""); // 選択中メニュー表示用

  // 画面表示時に localStorage から何のメニューを選んでいるか確認する
  useEffect(() => {
    const orderDataJson = localStorage.getItem("temp_reservation_order");
    if (orderDataJson) {
      try {
        const data = JSON.parse(orderDataJson);
        // コースか単品かで表示を切り分ける（UI用）
        if (data.courseId) {
          setOrderSummary(`コース予約 (ID: ${data.courseId})`);
        } else if (Array.isArray(data) && data.length > 0) {
          // 1. まず名前と数量のリストを作成
          const names = data
            .map((item: any) => `${item.name} × ${item.quantity}`)
            .join(", ");

          // 2. 「点数」と「詳細」をひとまとめにしてセットする
          // 例: 「単品メニュー 2 点: マルゲリータ × 1, ジェノベーゼ × 1」
          setOrderSummary(`単品メニュー ${data.length} 点: ${names}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const orderDataJson = localStorage.getItem("temp_reservation_order");
    if (!orderDataJson) {
      toast.error("メニュー注文情報が見つかりません。");
      return;
    }

    let parsedOrder;
    try {
      parsedOrder = JSON.parse(orderDataJson);
    } catch (e) {
      toast.error("注文データが壊れています。");
      return;
    }

    const time = formData.get("rsv_time") as string;
    const tableIdStr = formData.get("table_id") as string;

    if (!date || !time || !tableIdStr) {
      toast.error("すべての項目を入力してください。");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const rsvDate = new Date(date);
    rsvDate.setHours(hours, minutes, 0, 0);

    const personCount = parseInt(formData.get("person") as string);
    const tableId = parseInt(tableIdStr);

    const selectedTable = tableData.find((t) => t.table_id === tableId);
    if (
      !selectedTable ||
      personCount < 1 ||
      personCount > selectedTable.max_capacity
    ) {
      toast.error(
        `人数が不正、または${selectedTable?.table_name}の定員を超えています。`,
      );
      return;
    }

    // --- ここでバックエンドの形式に合わせてデータを整形 ---
    const result = await createReservation({
      userId,
      rsv_date: rsvDate,
      person: personCount,
      table_id: tableId,
      // localStorageの中身が {courseId: 1} なら courseId に、配列なら orderData に入れる
      courseId:
        parsedOrder.find((item: any) => item.type === "course")?.id || null,
      orderData: parsedOrder
        .filter((item: any) => item.type === "menu")
        .map((item: any) => ({
          m_id: item.id,
          quantity: item.quantity,
        })),
    });

    if (result.success) {
      localStorage.removeItem("temp_reservation_order");
      toast.success("予約が完了しました！");
      router.push("/reserveList");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className="flex-1 bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-white/20 w-full flex flex-col"
    >
      <h2 className="text-2xl font-bold text-white flex items-center justify-center h-20 mb-8 bg-gray-900 rounded-t-xl -mt-10 -mx-10 shadow-inner">
        <span>予約詳細の入力</span>
      </h2>

      <div className="flex-grow flex flex-col justify-around min-h-[500px]">
        {/* ★ 追加：選択中のメニュー情報を確認用として表示 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 flex items-center gap-3 mb-4">
          <Utensils className="text-red-600 h-5 w-5" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              選択中のメニュー
            </p>
            <p className="text-sm font-medium text-gray-800">
              {orderSummary || "未選択"}
            </p>
          </div>
        </div>

        {/* 予約日付 */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">予約日</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: ja })
                ) : (
                  <span>日付を選択</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 予約時間 */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">予約時間</label>
          <Select name="rsv_time" required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="時間を選択" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 21 }).map((_, i) => {
                const hour = Math.floor(i / 2) + 11;
                const min = i % 2 === 0 ? "00" : "30";
                const t = `${hour}:${min}`;
                return (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* 予約人数 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="person" className="text-lg font-medium text-gray-700">
            予約人数
          </label>
          <Input
            type="number"
            id="person"
            name="person"
            min="1"
            value={person}
            onChange={(e) => setPerson(parseInt(e.target.value) || 1)}
            className="h-12"
            required
          />
        </div>

        {/* テーブル選択 */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">
            テーブル（イタリア都市名）
          </label>
          <Select name="table_id" required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="テーブルを選択" />
            </SelectTrigger>
            <SelectContent>
              {tableData.map((table) => (
                <SelectItem key={table.table_id} value={String(table.table_id)}>
                  {table.table_name} (最大{table.max_capacity}名)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-10">
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-7 rounded-full transition-all shadow-lg font-bold"
        >
          予約を確定する
        </Button>
        <ReturnButton isLoggedIn={true} returnUrl="/myPage" />
      </div>
    </form>
  );
}
