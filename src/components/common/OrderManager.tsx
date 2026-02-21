"use client";

import { useState } from "react";
import CourseOrderControls from "./CourseOrderControls";
import MenuOrderControls from "./MenuOrderControls";
import { ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TransitionButton } from "./TransitionButton";

export default function OrderManager({
  menuType,
  finalCourseList,
  isLoggedIn,
}: any) {
  // 全ての注文を一括管理
  // keyは "course-1" や "menu-3" のようにして一意にします
  const [orders, setOrders] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleReserveWithLoading = async () => {
    // 💡 ステップ1: 自分の手でローディングをONにする！
    setIsLoading(true);

    try {
      // 💡 ステップ2: ユーザーに「処理してる感」を出すために少し待つ
      // 300ms〜500msくらいあると、人間は「あ、動いてる」って認識しやすいよ✨
      await new Promise((r) => setTimeout(r, 300));

      // 💡 ステップ3: 実際の処理
      await handleReserve();
    } catch (error) {
      console.error(error);
      // エラーの時だけ false に戻す（遷移に失敗した時用）
      setIsLoading(false);
    } finally {
      // 💡 ステップ4: 基本は router.push で画面が消えるけど、
      // 万が一ページに残った時のために isLoading を false に戻す
      // ※ 遷移が始まるとこのコンポーネント自体が消えるから、実質「出しっぱなし」にできる！
      // setIsLoading(false); // あえてコメントアウトするか、遷移後に戻る設定にする
    }
  };

  // 注文の有無を確認
  const hasOrder = Object.values(orders).some((q) => q > 0);

  // 予約処理
  const handleReserve = async () => {
    const orderData = Object.entries(orders)
      .filter(([, quantity]) => quantity > 0)
      .map(([key, quantity]) => {
        const [type, id] = key.split("-");
        const parsedId = parseInt(id, 10);

        let name = "不明なメニュー"; // 初期値

        if (type === "course") {
          const course = finalCourseList.find((c: any) => c.c_id === parsedId);
          name = course?.c_name || name;
        } else if (type === "menu") {
          // ★ここが重要：menuTypeの中にある全メニューをフラットにして探す
          const allMenus = menuType.flatMap((mt: any) => mt.menu);
          const menu = allMenus.find((m: any) => m.m_id === parsedId);
          name = menu?.m_name || name; // ここで m_name を代入！
        }
        return { id: parsedId, type, quantity, name };
      })
      // null（不正なデータ）を排除
      .filter((item) => item !== null);

    // 保存と遷移を try-catch で囲む
    try {
      localStorage.setItem("temp_reservation_order", JSON.stringify(orderData));
      await router.push("/reserve");
    } catch (error) {
      console.error("Failed to save order to localStorage:", error);
      // Consider showing user feedback here
      // ユーザーへの通知（お好みで alert など）
      alert(
        "注文情報の保存に失敗しました。ブラウザの設定（プライベートモード等）を確認してください。",
      );
    }
  };

  return (
    <>
      {/* コースセクション */}
      {finalCourseList &&
        Array.isArray(finalCourseList) &&
        finalCourseList.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold text-[#4A2C2A]">Course Menu</h2>
              <span className="text-[#8B5E3C] text-sm font-medium">
                コース料理
              </span>
              <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
            </div>
            <CourseOrderControls
              courseList={finalCourseList}
              orders={orders}
              setOrders={setOrders}
              isLoggedIn={isLoggedIn}
            />
          </section>
        )}
      {/* グランドメニューセクション */}
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl flex items-center gap-4 mb-12 mx-auto px-4">
          <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
          <h2 className="text-3xl font-bold text-[#4A2C2A] whitespace-nowrap">
            Grand Menu
          </h2>
          <span className="text-[#8B5E3C] text-sm font-medium">アラカルト</span>
          <div className="flex-grow h-[1px] bg-[#EBE3D5]"></div>
        </div>
        <MenuOrderControls
          menuTypes={menuType}
          orders={orders}
          setOrders={setOrders}
          isLoggedIn={isLoggedIn}
        />
      </section>

      {/* 統合注文バー（ここに1つだけ配置！） */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#EBE3D5] transition-all duration-300 z-50 flex justify-center items-center gap-4 ${hasOrder ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        <p className="hidden sm:block text-[#4A2C2A] font-medium italic">
          メニューが選択されました
        </p>
        {isLoggedIn ? (
          <Button
            size="lg"
            disabled={isLoading}
            onClick={handleReserveWithLoading}
            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 rounded-full shadow-lg flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>送信中...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>注文を確定して予約へ</span>
              </>
            )}
          </Button>
        ) : (
          <TransitionButton
            href="/login"
            loadingText="ログイン画面へ..."
            size="lg"
            className="bg-[#8B5E3C] hover:bg-[#4A2C2A] text-white px-8 rounded-full shadow-lg flex items-center gap-2"
          >
            <LogIn size={18} />
            <span>ログインして予約へ</span>
          </TransitionButton>
        )}
      </div>
    </>
  );
}
