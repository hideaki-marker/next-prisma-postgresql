// src/app/menuInsert/page.tsx
"use client"; // Client Component として動作させるために必要

import { useForm } from "react-hook-form"; // useForm をインポート
// Form, FormField もインポートする
import {
  Form, // FormProvider の役割を果たす
} from "@/components/ui/form";
import { z } from "zod"; // バリデーションのため (もし zod を使うなら)
import { zodResolver } from "@hookform/resolvers/zod"; // zodResolver をインポート (もし zod を使うなら)
import { useEffect, useState } from "react"; // useEffect と useState をインポート
import { MenuFormFields } from "@/components/common/MenuFormFields";
import { commonMenuSchema } from "@/components/common/formSchemas";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";

type MenuData = z.infer<typeof commonMenuSchema>;

export default function MenuInsertPage() {
  // 1. useForm を呼び出してフォームインスタンスを取得
  const form = useForm<MenuData>({
    resolver: zodResolver(commonMenuSchema), // バリデーションにZodResolverを使用
    defaultValues: {
      menuName: "",
      price: 0,
      orderFlg: 0, // デフォルト値を設定
      menuType: "",
      detail: "",
    },
  });

   const [menuType, setMenuType] = useState<string[]>([]); // menuTypesを保持するstate

   useEffect(() => {
    // コンポーネントマウント時にAPIからmenuTypesを取得
    async function fetchMenuType() {
      try {
        const response = await fetch('/api/menuType');
        if (!response.ok) {
          throw new Error('Failed to fetch menu types');
        }
        const data: string[] = await response.json();
        setMenuType(data);
        // 最初の項目をデフォルト値として設定するか、空のままにするか選択
        if (data.length > 0 && !form.getValues().menuType) {
            form.setValue('menuType', data[0]); // 最初の項目をデフォルトに設定
        }
      } catch (error) {
        console.error("Error fetching menu types:", error);
      }
    }
    fetchMenuType();
  }, [form]); // formインスタンスが変更された場合のみ再実行 (通常は初回のみ)

  // フォーム送信時の処理
  async function onSubmit(values: z.infer<typeof commonMenuSchema>) { // async を追加
  console.log("フォームデータ:", values);

  try {
    const response = await fetch('/api/menu', { // 作成したAPIエンドポイントを呼び出す
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values), // フォームデータをJSON形式で送信
    });

    if (!response.ok) {
      // APIからのエラーレスポンスを処理
      const errorData = await response.json();
      throw new Error(errorData.message || 'メニューの登録に失敗しました。');
    }

    const data = await response.json();
    console.log("登録成功:", data);
    alert('メニューが正常に登録されました！'); // 成功メッセージを表示
    form.reset(); // フォームをリセット

  } catch (error) {
    console.error("メニュー登録エラー:", error);
    alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`); // エラーメッセージを表示
  }
}

  return (
    // 2. Form コンポーネントでフォーム全体をラップし、useForm の結果を渡す
    <Form {...form}>
      {/* 3. HTMLの <form> タグを使い、handleSubmit を紐付ける */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="font-bold text-5xl mb-8 flex items-center justify-center">新しいメニューの登録</h1>

        {/* メニュー名フィールド */}
        {/* 4. FormField で各入力フィールドをラップする */}
        {/* ★変更点★: 共通コンポーネントを呼び出し */}
       <MenuFormFields control={form.control} menuTypeOptions={menuType} />
        
        {/* ★変更点: ここにあった <br /> を削除し、ボタンをラップする div にマージします */}
        
        {/* ★ここから登録ボタンの修正★ */}
       <div className="flex justify-center w-full "> 
          <Button
            type="submit"
            className="
              bg-blue-500 hover:bg-blue-700 text-white font-bold
              py-3 px-8 rounded-lg text-lg tracking-wider
              transition-colors duration-200 ease-in-out
              w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12 {/* ここを短く調整 */}
              mx-auto md:ml-auto md:mr-0 {/* mx-auto と md:ml-auto で中央と右寄せを切り替え */}
            " 
          >
            登録
          </Button>
        </div>
        {/* ★ここまで登録ボタンの修正★ */}

        <br /> {/* ボタンの下に管理者ページとのスペースを空けるため */}
        <Link href="/adminIndex" className="flex items-center text-4xl justify-center">
        <p className="flex items-center text-4xl justify-center">◆管理者ページ</p>
        </Link>
      </form>
    </Form>
  );
}