"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

// Propsの定義
interface LoginFormBaseProps {
  title: string;
  description?: string;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isLoading: boolean;
  message: string | null;
  messageType?: "error" | "success";
  submitButtonText?: string;
  submitButtonClassName?: string;
  children?: React.ReactNode; // CardFooterに入れたいもの（戻るボタンなど）
}

export function LoginForm({
  title,
  description,
  onSubmit,
  register,
  errors,
  isLoading,
  message,
  messageType = "error",
  submitButtonText = "ログイン",
  submitButtonClassName = "bg-[#D32F2F] hover:bg-[#B71C1C]",
  children,
}: LoginFormBaseProps) {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* ユーザー名入力 */}
          <div className="space-y-1">
            <label htmlFor="name" className="sr-only">
              ユーザー名
            </label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "ユーザー名は必須です" })}
              placeholder="ユーザー名"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-red-500 text-xs ml-1">
                {errors.name.message as string}
              </p>
            )}
          </div>
          {/* パスワード入力 */}
          <div className="space-y-1">
            <label htmlFor="password" className="sr-only">
              パスワード
            </label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "パスワードは必須です" })}
              placeholder="パスワード"
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-red-500 text-xs ml-1">
                {errors.password.message as string}
              </p>
            )}
          </div>{" "}
          {/* ログイン全体のエラー表示 (お客様ログインのAlertを流用) */}
          {message && (
            <Alert
              variant={messageType === "error" ? "destructive" : "default"}
              className={`mt-4 ${messageType === "success" ? "border-green-500 bg-green-50 text-green-700" : ""}`}
            >
              {/* 💡 ここ！メッセージタイプによってアイコンを使い分ける */}
              {messageType === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}

              <AlertTitle>
                {messageType === "error" ? "エラー" : "成功"}
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {/* 送信ボタン */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full h-10 transition-all ${submitButtonClassName} text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン処理中...
              </div>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>
      </CardContent>

      {/* 戻るボタンなどがあれば表示 */}
      {children && (
        <CardFooter className="pt-2 flex justify-center">{children}</CardFooter>
      )}
    </Card>
  );
}
