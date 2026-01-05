"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { MenuFormFields } from "@/components/common/MenuFormFields";
import { updateMenuSchema } from "@/components/common/formSchemas";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

// ----------------------------------------------------
// ★ 1. 渡されるデータの型をエラーメッセージを元に定義する (PassedMenuData)
// ----------------------------------------------------
type PassedMenuData = {
    menuType: {
        t_name: string | null;
    };
} & {
    price: number;
    orderFlg: boolean | null;
    detail: string | null;
    t_id: number;
    m_id: number; // DBのメニューID
    m_name: string;
};

// ----------------------------------------------------
// ★ 2. Props の定義を修正する
// ----------------------------------------------------
type Props = {
    // フォームに渡されるProp名を 'menuData' に変更し、型を PassedMenuData に変更
    menuData: PassedMenuData; 
    menuTypeOptions: string[];
    onClose: () => void;
}

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

// ----------------------------------------------------
// ★ 3. コンポーネントの関数シグネチャと defaultValues を修正する
// ----------------------------------------------------
export default function MenuUpdateForm({ menuData, menuTypeOptions, onClose }: Props) {

  const form = useForm<MenuData>({ // ★変更: MenuData を型として指定
    resolver: zodResolver(updateMenuSchema),
    defaultValues: {
             id: String(menuData.m_id), 
             menuName: menuData.m_name,
             price: menuData.price,
             orderFlg: menuData.orderFlg === true ? 1 : 0,
             menuType: menuData.menuType.t_name || "",
             detail: menuData.detail || "",
        },
  });

  useEffect(() => {
        if (menuData) {
            // 親から渡された最新の menuData をフォームの型に変換
            const transformedData: MenuData = {
                id: String(menuData.m_id), 
                menuName: menuData.m_name,
                price: menuData.price,
                orderFlg: menuData.orderFlg === true ? 1 : 0, 
                // 安全なアクセス：オプショナルチェイニング `?.` を使用
                menuType: menuData.menuType?.t_name || "", 
                detail: menuData.detail || "",
            };
            
            // ★ form.reset を実行して、最新データでフォームの状態を強制的に更新 ★
            form.reset(transformedData); 
        }
        // menuData が変更されたとき、このフォームも再初期化される
    }, [menuData, form]);
  
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

      const updatedMenuData: PassedMenuData = await response.json();
      console.log("更新成功:", updatedMenuData);
      // alert('メニューが正常に更新されました！'); // 成功メッセージを表示
      // form.reset(); // 更新なのでリセットは不要、または更新された値で再設定
      // 必要であれば、更新後に別のページにリダイレクトすることも可能
      // useRouter().push('/showMenu'); など
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("メニュー更新エラー:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  return (
    // ページ全体の中央寄せは、このコンポーネントの外側で設定するとして、
    // ここではフォーム本体を Card で美しく囲むよ！
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-8 p-4 md:p-6">
        
        <Card>
          
          {/* ページのヘッダー部分 */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              {/* タイトル */}
              <CardTitle className="text-3xl font-bold tracking-tight flex-1 text-center pr-12">
                メニューの更新
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* メニューID表示（強調） */}
            <div className="text-center mb-6 p-3 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-500">更新対象メニューID:</p>
              <p className="font-extrabold text-2xl text-blue-600">{menuData.m_id}</p>
            </div>
            {/* MenuFormFields 本体 */}
            <MenuFormFields control={form.control} menuTypeOptions={menuTypeOptions} />
          </CardContent>
          <CardFooter className="pt-6 border-t flex justify-center">
            {/* 更新ボタンを shadcn の Button に変更 */}
            <Button 
              type="submit"
              size="lg" // 大きめのボタンで目立たせる
              className="w-1/2 md:w-1/3 text-lg"
              disabled={form.formState.isSubmitting} // ロード状態は formState を使うとスマート
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                'メニューを更新'
              )}
            </Button>
          </CardFooter>
          
        </Card>
      </form>
    </Form>
  );
}