import { z } from "zod";

// 登録・更新で共通のスキーマ
export const commonMenuSchema = z.object({
  menuName: z.string().min(1, { message: "メニュー名は必須です。" }),
  price: z.number().min(0, { message: "価格は0以上である必要があります。" }),
  orderFlg: z.number().min(0).max(1),
  menuType: z.string().min(1, { message: "カテゴリーを選択してください。" }),
  detail: z.string().max(200, { message: "説明は200文字以内です。" }).optional(),
});

// 更新ページ専用のスキーマ（idを追加）
export const updateMenuSchema = commonMenuSchema.extend({
    id: z.string().optional(),
});