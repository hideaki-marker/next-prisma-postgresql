"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginForm } from "@/components/common/LoginForm";

type LoginFormData = {
  name: string;
  password: string;
};

export default function LoginPage() {
  // useStateとメッセージはログイン失敗時のために残す
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useFormでフォームの状態を管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    // 処理開始: ローディングを true に設定
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // ★この行を追加
      });
      if (response.redirected) {
        // 💡 もしサーバー側でリダイレクトが発生したら、そのURLへスムーズに飛ばす
        setMessageType("success");
        setMessage("リダイレクト中...");
        router.push(response.url);
        return; // ここで処理を終了させる
      } else if (response.ok) {
        // ログイン成功時のメッセージを表示
        setMessage("ログインに成功しました！");
        setMessageType("success");
        // クライアント側でリダイレクトする場合
        // 2. 【重要】Reactがこの「成功」を画面に反映させるための時間を強制的に作る
        // await Promise.resolve(); // マイクロタスクを実行

        // 3. 画面を確実に確認するため、あえて長めに止める（2秒）
        setTimeout(() => {
          router.push("/myPage");
        }, 2000);
        return;
      } else {
        // ログイン失敗時のエラーメッセージ処理
        const errorData = await response.json();
        setMessage(errorData.message || "ログインに失敗しました。");
        setMessageType("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("ログイン中にエラーが発生しました:", error);
      setMessage("サーバーエラーが発生しました。");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat bg-[url('/NewCustomerRegistration.png')]">
      {/* 元のフォームを囲む div を Card コンポーネントに置き換える！ */}
      <LoginForm
        title="🔐 ログイン"
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        message={message}
        submitButtonClassName="bg-black hover:bg-zinc-800 text-white"
        messageType={messageType}
      />
    </div>
  );
}
