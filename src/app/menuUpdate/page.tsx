"use client"; // Client Component として動作させるために必要

import { useForm } from "react-hook-form";
import {
  Form,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'; // ★追加: URLパラメータを取得するため
import { MenuFormFields } from "@/components/common/MenuFormFields";
import { updateMenuSchema } from "@/components/common/formSchemas";

// フォームのスキーマを定義
const formSchema = z.object({
  id: z.string().optional(), // ★追加: 更新対象のID。URLから取得するためoptionalとする
  menuName: z.string().min(1, { message: "メニュー名は必須です。" }),
  price: z.number().min(0, { message: "価格は0以上である必要があります。" }),
  orderFlg: z.number().min(0).max(1),
  menuType: z.string().min(1, { message: "カテゴリーを選択してください。" }),
  detail: z.string().max(200, { message: "説明は200文字以内です。" }).optional(),
});

// メニューデータの型定義（APIから取得するデータ構造に合わせる）
// Prismaの生成型を使用することもできますが、ここではZodスキーマを元に定義します
type MenuData = z.infer<typeof formSchema>;


export default function MenuUpdatePage() { // ★変更: 関数名を MenuUpdatePage に変更
  const searchParams = useSearchParams(); // URLパラメータを取得
   const menuId = searchParams?.get('id');// 'id' パラメータの値を取得

  const form = useForm<MenuData>({ // ★変更: MenuData を型として指定
    resolver: zodResolver(updateMenuSchema),
    defaultValues: {
      id: menuId || undefined, // URLから取得したIDを設定
      menuName: "",
      price: 0,
      orderFlg: 0,
      menuType: "",
      detail: "",
    },
  });

  const [menuType, setMenuType] = useState<string[]>([]); // ★変更: 変数名を menuType から menuTypeOptions に変更

  // カテゴリー（menuType）の取得
  useEffect(() => {
    async function fetchMenuTypeOptions() { // ★変更: 関数名を fetchMenuType から fetchMenuTypeOptions に変更
      try {
        const response = await fetch('/api/menuType');
        if (!response.ok) {
          throw new Error('Failed to fetch menu types');
        }
        const data: string[] = await response.json();
        setMenuType(data);
      } catch (error) {
        console.error("Error fetching menu types:", error);
      }
    }
    fetchMenuTypeOptions();
  }, [form]);


  // ★追加: 既存メニューデータのフェッチとフォームへの設定
  useEffect(() => {
    async function fetchMenuData() {
      if (menuId) { // menuId が存在する場合のみフェッチ
        try {
          // ここではまだ `/api/menu/[id]` は作成していませんが、
          // 後ほど作成するAPIエンドポイントを想定して記述します。
          const response = await fetch(`/api/menu/${menuId}`); 
          if (!response.ok) {
            throw new Error('Failed to fetch menu data');
          }
          const data: MenuData = await response.json();
          // フォームの値をAPIから取得したデータでリセット（初期値として設定）
          form.reset({
            id: data.id, // IDも設定
            menuName: data.menuName,
            price: data.price,
            // APIから数値 (0/1) として取得されることを想定し、そのまま利用
            orderFlg: data.orderFlg, 
            menuType: data.menuType,
            detail: data.detail || "", // detail が null の可能性を考慮
          });
        } catch (error) {
          console.error(`Error fetching menu data for ID ${menuId}:`, error);
          alert(`メニューデータの取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
        }
      }
    }
    fetchMenuData();
  }, [menuId, form]); // menuId または form インスタンスが変わった時に再実行


  // フォーム送信時の処理
  async function onSubmit(values: MenuData) { // ★変更: 型を MenuData に変更
    console.log("フォームデータ:", values);

    if (!values.id) {
      alert("更新するメニューのIDがありません。");
      return;
    }

    try {
      // ★変更: 更新用APIエンドポイントを呼び出す
      const response = await fetch(`/api/menu/${values.id}`, {
        method: 'PUT', // 更新なのでPUTメソッドを使用
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // フォームデータをJSON形式で送信
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'メニューの更新に失敗しました。');
      }

      const data = await response.json();
      console.log("更新成功:", data);
      alert('メニューが正常に更新されました！'); // 成功メッセージを表示
      // form.reset(); // 更新なのでリセットは不要、または更新された値で再設定
      // 必要であれば、更新後に別のページにリダイレクトすることも可能
      // useRouter().push('/showMenu'); など
    } catch (error) {
      console.error("メニュー更新エラー:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ★変更: ページタイトルを更新用に変更 */}
        <h1 className="font-bold text-5xl mb-8 flex items-center justify-center">メニューの更新</h1>

        {/* メニューID表示（デバッグ用、本番では非表示/隠しフィールドでも良い） */}
        {menuId && (
            <div className="flex flex-col items-center mb-4">
                <FormLabel>更新対象ID:</FormLabel>
                <p className="font-bold text-xl">{menuId}</p>
            </div>
        )}
        <br />

        {/* メニュー名フィールド */}
        <MenuFormFields control={form.control} menuTypeOptions={menuType} />
        
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="
              bg-blue-500 hover:bg-blue-700 text-white font-bold
              py-3 px-8 rounded-lg text-lg tracking-wider
              transition-colors duration-200 ease-in-out
              w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12
              mx-auto
            " 
          >
            更新 {/* ★変更: ボタンのテキストを「更新」に変更 */}
          </button>
        </div>

        <br />

        <p className="flex items-center text-4xl justify-center">◆管理者ページ</p>
      </form>
    </Form>
  );
}