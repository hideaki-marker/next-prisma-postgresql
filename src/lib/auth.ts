import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * トークンを検証し、ユーザーIDを返します
 */
export function getUserIdFromAuthToken(token: string): number {
  // 1. まず環境変数の存在を確定させる
  if (!JWT_SECRET) {
    throw new Error("環境変数 JWT_SECRET が設定されていません。");
  }

  try {
    // 2. 戻り値を一度 unknown か JwtPayload として受け取る
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. decoded が文字列ではなくオブジェクトであり、かつ id を持っているかチェック
    if (typeof decoded !== "string" && decoded && "id" in decoded) {
      return (decoded as any).id as number;
    }

    throw new Error("トークンの形式が不正です。");
  } catch (error) {
    console.error("トークンの検証に失敗しました:", error);
    throw new Error("認証セッションが切れました。再度ログインしてください。");
  }
}
