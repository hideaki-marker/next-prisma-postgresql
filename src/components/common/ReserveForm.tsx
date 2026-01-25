"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
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

  const handleSubmit = async (formData: FormData) => {
    // 1. 注文データの取得
    const orderDataJson = localStorage.getItem("temp_reservation_order");
    if (!orderDataJson) {
      toast.error("メニュー注文情報が見つかりません。");
      return;
    }

    // JSONの解析を安全に行う
    let orderData;
    try {
      orderData = JSON.parse(orderDataJson);
    } catch (e) {
      console.error("JSON parse error:", e);
      toast.error(
        "注文データが壊れています。もう一度メニューを選び直してください。",
      );
      return;
    }

    // 2. 日時・人数・テーブルの取得
    const time = formData.get("rsv_time") as string;
    const tableIdStr = formData.get("table_id") as string;

    if (!date || !time || !tableIdStr) {
      toast.error("予約情報（日付・時間・テーブル）をすべて入力してください。");
      return;
    }

    // 日付と時間を合成
    const [hours, minutes] = time.split(":").map(Number);
    const rsvDate = new Date(date);
    rsvDate.setHours(hours, minutes, 0, 0);

    const personCount = parseInt(formData.get("person") as string);
    const tableId = parseInt(tableIdStr);

    if (Number.isNaN(personCount) || Number.isNaN(tableId)) {
      toast.error("人数またはテーブルの選択が正しくありません。");
      return;
    }

    // バリデーション（テーブル収容人数など）
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
    const result = await createReservation({
      userId,
      rsv_date: rsvDate,
      person: personCount,
      table_id: tableId,
      orderData: orderData,
    });

    if (result.success) {
      localStorage.removeItem("temp_reservation_order");
      toast.success("予約が完了しました！");
      router.push("/reserveList");
    } else {
      toast.error(result.message || "予約登録中にエラーが発生しました。");
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
      {/* 1. タイトル部分を均等配置の外に出す（これで余白が固定されます） */}
      <h2 className="text-2xl font-bold text-white flex items-center justify-center h-20 mb-8 bg-gray-900 rounded-t-xl -mt-10 -mx-10 shadow-inner">
        <span>予約詳細の入力</span>
      </h2>

      {/* 2. 入力項目だけを flex-grow で囲み、ここで余白を均等に分配する */}
      <div className="flex-grow flex flex-col justify-around min-h-[450px]">
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
          <label className="text-lg font-medium text-gray-700">テーブル</label>
          <Select name="table_id" required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="テーブルを選択" />
            </SelectTrigger>
            <SelectContent>
              {tableData.map((table) => (
                <SelectItem key={table.table_id} value={String(table.table_id)}>
                  {table.table_name} ({table.max_capacity}人席)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ボタンエリア */}
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
