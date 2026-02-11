import "server-only"; // これを入れると、誤ってクライアント側でインポートした際にビルドエラーで教えてくれます
import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: "minio", // Docker外(ホスト)からの場合は localhost
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});

export const BUCKET_NAME = "restaurant-photos";

// --- ここから初期設定コード ---
export const initMinio = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      // 箱がなければ作る
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);

      // 画像をブラウザから直接見れるように「公開設定」にする（重要！）
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
  } catch (err) {
    console.error("MinIO初期設定エラー:", err);
  }
};
