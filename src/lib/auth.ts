import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * トークンを検証し、ユーザーIDを返します
 */
export function getUserIdFromAuthToken(token: string): number {
  try {
    // トークンをデコード
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // ログイン時に設定した 'id' を返す
    return decoded.id;
  } catch (error) {
    console.error("トークンの検証に失敗しました:", error);
    throw new Error("認証セッションが切れました。再度ログインしてください。");
  }
}
