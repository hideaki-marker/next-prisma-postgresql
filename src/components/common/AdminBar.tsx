"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // 以前作成したAPIを叩く
      const res = await fetch("/api/admin/check"); // ファイルパスに合わせて調整してください
      const data = await res.json();

      // APIの返り値「authenticated」を使って判定
      setIsLoggedIn(data.authenticated === true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      setIsLoggedIn(false);
      toast.success("ログアウトしました");
      router.push("/");
      router.refresh();
    } catch (error) {
      // 4. 失敗した場合は、ユーザーに「まだログアウトできてないよ！」と教える
      console.error("Logout error:", error);
      toast.error(
        "ログアウトに失敗しました。通信環境を確認して、もう一度お試しください。",
      );
    }
  };
  return (
    <footer className="p-2 bg-[#3d2b1f] text-white shadow-lg w-full h-16">
      <div className="container mx-auto flex justify-end items-center h-full px-6">
        <div className="flex gap-6">
          {" "}
          {isLoggedIn ? (
            <>
              <Link
                href="/adminIndex"
                className="text-base hover:text-gray-400 font-medium transition-colors"
              >
                管理画面トップ
              </Link>
              <button
                onClick={handleLogout}
                className="text-base hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/adminLogin"
              className="text-base hover:text-gray-500 font-medium transition-colors"
            >
              管理者ログイン
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
