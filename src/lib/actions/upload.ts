"use server";

import { minioClient, BUCKET_NAME, initMinio } from "@/lib/minio";
import { randomUUID } from "crypto";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ファイル名から安全な拡張子のみを抽出する
 */
function getSafeExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return ""; // 拡張子がない場合
  const ext = parts.pop()?.toLowerCase() || "";
  // 英数字以外の文字を除去して、安全な拡張子だけを返す
  const safeExt = ext.replace(/[^a-z0-9]/g, "");
  return safeExt ? `.${safeExt}` : "";
}

export async function uploadMenuImage(formData: FormData): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  //console.log("--- 📂 アップロード処理開始 ---");
  try {
    // 1. バケットの初期化チェック
    const isInitialized = await initMinio();
    if (!isInitialized) {
      return { success: false, error: "ストレージの初期化に失敗しました" };
    }

    // 2. ファイルの存在チェック（throw ではなく return で返す）
    const file = formData.get("image") as File;
    if (!file || file.size === 0) {
      return { success: false, error: "ファイルがありません" };
    }

    // 3. ファイル形式（MIMEタイプ）のチェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `許可されていない形式です (${file.type})。JPG, PNG, GIF, WebPのみ対応しています。`,
      };
    }

    // 4. ファイルサイズのチェック
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: "ファイルサイズが大きすぎます (最大5MBまで)",
      };
    }

    // ファイル名をユニークにする
    const fileName = `temp_${randomUUID()}${getSafeExtension(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 1200, // PC用にある程度大きく
        withoutEnlargement: true, // 元画像が小さい場合は無理に拡大しない
      })
      .webp({ quality: 85 }) // 画質と軽さの黄金比
      .toBuffer();

    // 3. MinIOにアップロード
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      optimizedBuffer,
      optimizedBuffer.length,
      {
        "Content-Type": "image/webp",
      },
    );

    // 2. ブラウザで表示するためのURLを返す
    // 注意：保存時に使うために「fileName」を返すのがおすすめです
    //console.log("✅ MinIOへの保存に成功しました！");
    return { success: true, fileName: fileName };
  } catch (error: any) {
    //console.error("❌ MinIOアップロード致命的エラー:", error.message);
    return {
      success: false,
      error: error.message || "アップロード中に予期せぬエラーが発生しました",
    };
  }
}
