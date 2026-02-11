"use server";

import { minioClient, BUCKET_NAME } from "@/lib/minio";
// prisma の import は一旦不要になります（ここでは保存しないため）

export async function uploadMenuImage(formData: FormData): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  //console.log("--- 📂 アップロード処理開始 ---");
  const file = formData.get("image") as File;
  if (!file) throw new Error("ファイルがありません");

  // ファイル名をユニークにする（IDがないのでタイムスタンプ等で作成）
  const fileName = `temp_${Date.now()}_${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // 1. MinIOにアップロード
    await minioClient.putObject(BUCKET_NAME, fileName, buffer, file.size, {
      "Content-Type": file.type,
    });

    // 2. ブラウザで表示するためのURLを返す
    // 注意：保存時に使うために「fileName」を返すのがおすすめです
    //console.log("✅ MinIOへの保存に成功しました！");
    return { success: true, fileName: fileName };
  } catch (error: any) {
    //console.error("❌ MinIOアップロード致命的エラー:", error.message);
    return { success: false };
  }
}
