"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ReturnButton from "@/components/common/ReturnButton";
import { LoginForm } from "@/components/common/LoginForm";

type LoginFormData = {
  name: string;
  password: string;
};

export default function AdminLoginPage() {
  // useStateとメッセージはログイン失敗時のために残す
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useFormでフォームの状態を管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // ★この行を追加
      });

      if (response.redirected) {
        // API側でリダイレクトが成功した場合、クライアント側では何もしない
        setMessageType("success");
        setMessage("リダイレクト中...");
        setTimeout(() => {
          router.push(response.url);
        }, 2000);
        return;
      } else if (response.ok) {
        // ログイン成功時のメッセージを表示
        setMessageType("success");
        setMessage("管理者ページにログインに成功しました！");
        setIsLoggedIn(true);
        // クライアント側でリダイレクトする場合
        // ✨ これが大事！2秒間「await」で関数を足止めする
        setTimeout(() => {
          router.push("/adminIndex");
        }, 2000);

        return; // ここで関数を終了させることで、Reactがすぐに再描画（緑色に）できるよ✨
      } else {
        // ログイン失敗時のエラーメッセージ処理
        const errorData = await response.json();
        setMessage(errorData.message || "管理者ページにログイン失敗しました。");
        setMessageType("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("管理者ページログイン中にエラーが発生しました:", error);
      setMessage("サーバーエラーが発生しました。");
      setMessageType("error"); // キャッチ時もエラータイプに
      setIsLoading(false); // エラー時もボタンを再度有効にする
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat bg-[url('/Kitchen.png')]">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[4px] z-10" />
      <div className="relative z-20 w-full max-w-md px-4">
        <LoginForm
          title="管理者ページログイン"
          description="ログイン情報を入力してください"
          submitButtonClassName="bg-green-700 hover:bg-green-800"
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isLoading}
          message={message}
          messageType={messageType}
        >
          <ReturnButton isLoggedIn={isLoggedIn} />
        </LoginForm>
      </div>
    </div>
  );
}
