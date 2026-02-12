"use client";

import { Control, FieldValues } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadMenuImage } from "@/lib/actions/upload"; // 先ほど作成したAction
import { commonMenuSchema } from "./formSchemas";

import { z } from "zod";
import { useState } from "react";

// ★変更点★: Propsの型を具体的な型に制約
type MenuFormData = z.infer<typeof commonMenuSchema>;

interface MenuFormFieldsProps {
  control: Control<MenuFormData>;
  menuTypeOptions: string[];
}

const getMinioUrl = (fileName: string) => {
  const protocol = process.env.NEXT_PUBLIC_MINIO_PROTOCOL || "http";
  const host = process.env.NEXT_PUBLIC_MINIO_HOSTNAME || "localhost";
  const port = process.env.NEXT_PUBLIC_MINIO_PORT || "9000";
  // バケット名も環境変数から取得（なければデフォルト）
  const bucket =
    process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || "restaurant-photos";

  return `${protocol}://${host}:${port}/${bucket}/${fileName}`;
};

/**
 * メニュー編集モーダル内の入力フォーム項目コンポーネント
 *  @param {MenuFormFieldsProps} props - コンポーネントに渡されるプロパティ
 * @param {Control<MenuFormData>} props.control - React Hook Form の制御オブジェクト
 * @param {string[]} props.menuTypeOptions - 選択可能なカテゴリー（メニュータイプ）のリスト
 * @returns {JSX.Element} メニュー編集用の入力フィールド群
 */
export function MenuFormFields({
  control,
  menuTypeOptions,
}: MenuFormFieldsProps) {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <>
      {/* --- 画像アップロードフィールドを追加 --- */}
      <FormField
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>メニュー画像</FormLabel>
            <FormControl className="w-full flex flex-col items-center gap-4">
              <div className="w-full flex flex-col items-center">
                {/* プレビュー表示: ファイル名がある場合のみ表示 */}
                {field.value && typeof field.value === "string" && (
                  <div className="mb-4 relative w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      // MinIOから直接画像を表示するためのURLを組み立てる
                      src={getMinioUrl(field.value)}
                      alt="Preview"
                      className="object-cover w-full h-full"
                      // 画像が読み込めない（404など）時の処理
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  className="w-2/3 mx-auto cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setIsUploading(true);
                    const formData = new FormData();
                    formData.append("image", file);

                    try {
                      // Server Action 呼び出し
                      const result = await uploadMenuImage(formData);

                      if (result.success && result.fileName) {
                        // DB保存用に「ファイル名」だけをセット
                        field.onChange(result.fileName);
                        console.log("アップロード成功:", result.fileName);
                      } else {
                        alert(
                          "アップロード失敗: " +
                            (result.error || "不明なエラー"),
                        );
                      }
                    } catch (error) {
                      console.error("通信エラー:", error);
                      alert("サーバーとの通信に失敗しました");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />

                {isUploading && (
                  <p className="text-xs text-orange-500 mt-2 animate-pulse">
                    アップロード中...
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />
      {/* メニュー名フィールド */}
      <FormField
        control={control}
        name="menuName"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <br />
            <FormLabel>メニュー名</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Input
                type="text"
                placeholder="名前"
                {...field}
                className="w-2/3 mx-auto"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />
      {/* 価格フィールド */}
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>価格</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Input
                type="number"
                placeholder="価格"
                {...field}
                value={
                  field.value == null || field.value === 0
                    ? ""
                    : String(field.value)
                }
                className="w-2/3 mx-auto [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* ラジオグループフィールド */}
      <FormField
        control={control}
        name="orderFlg"
        render={({ field }) => (
          <FormItem className="space-y-3 flex flex-col items-center">
            <FormLabel>オーダー可</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value ?? 0)}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1" />
                  </FormControl>
                  <FormLabel className="font-normal">可</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="0" />
                  </FormControl>
                  <FormLabel className="font-normal">不可</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* セレクトボックスフィールド */}
      <FormField
        control={control}
        name="menuType"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>カテゴリー</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl className="w-full flex justify-center">
                <SelectTrigger className="w-2/3 mx-auto">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {menuTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* メニュー説明テキストエリアフィールド */}
      <FormField
        control={control}
        name="detail"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>メニュー説明</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Textarea
                placeholder="メニューの詳細な説明を入力してください。"
                className="resize-y w-2/3 mx-auto"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
