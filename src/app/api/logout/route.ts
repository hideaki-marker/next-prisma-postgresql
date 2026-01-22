import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "ログアウトしました" },
    { status: 200 },
  );

  // 1. 一般ユーザー用のクッキーを削除
  response.cookies.delete("auth_token");

  // 2. 管理者用のクッキーを削除
  response.cookies.delete("admin_auth_token");

  // 必要であれば、ログインフラグなどもここで削除
  response.cookies.delete("is_logged_in");

  return response;
}
