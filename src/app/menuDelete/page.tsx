"use client";

import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from 'next/navigation'; // useRouterを追加
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button"; // 必要に応じてボタンコンポーネントも追加
import { Link } from "lucide-react";
// データの表示用なので、フォームスキーマは簡略化
const formSchema = z.object({
  id: z.string().optional(),
  menuName: z.string().optional(),
  price: z.number().optional(),
  orderFlg: z.number().optional(),
  menuType: z.string().optional(),
  detail: z.string().optional(),
});
type MenuData = z.infer<typeof formSchema>;

export default function MenuDeletePage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // useRouterを初期化
  const menuId = searchParams?.get('id');

  const form = useForm<MenuData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: menuId || undefined,
      menuName: "",
      price: 0,
      orderFlg: 0,
      menuType: "",
      detail: "",
    },
  });

  // 既存メニューデータのフェッチとフォームへの設定
  useEffect(() => {
    async function fetchMenuData() {
      if (menuId) {
        try {
          const response = await fetch(`/api/menu/${menuId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch menu data');
          }
          const data: MenuData = await response.json();
          form.reset({
            id: data.id,
            menuName: data.menuName,
            price: data.price,
            orderFlg: data.orderFlg,
            menuType: data.menuType,
            detail: data.detail || "",
          });
        } catch (error) {
          console.error(`Error fetching menu data for ID ${menuId}:`, error);
          alert(`メニューデータの取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
        }
      } else {
        alert("削除するメニューのIDが指定されていません。");
        router.push('/'); // IDがない場合はトップページにリダイレクト
      }
    }
    fetchMenuData();
  }, [menuId, form, router]);


  // 削除ボタン押下時の処理
  async function handleDelete() {
    if (!menuId) {
      alert("削除するメニューのIDがありません。");
      return;
    }

    // 削除前の最終確認
    if (!window.confirm("本当にこのメニューを削除しますか？")) {
        return;
    }

    try {
      const response = await fetch(`/api/menu/${menuId}`, {
        method: 'DELETE', // メソッドをDELETEに変更
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'メニューの削除に失敗しました。');
      }

      console.log("削除成功");
      alert('メニューが正常に削除されました！');
      router.push('/showMenu'); // 削除成功後、メニュー一覧ページにリダイレクト
    } catch (error) {
      console.error("メニュー削除エラー:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  const menuData = form.getValues();

  return (
    <Form {...form}>
      <div className="space-y-8">
        <h1 className="font-bold text-5xl mb-8 flex items-center justify-center">メニューの削除</h1>

        {menuId && (
            <div className="flex flex-col items-center mb-4">
                <FormLabel>削除対象ID:</FormLabel>
                <p className="font-bold text-xl">{menuId}</p>
            </div>
        )}
        
        {/* データ表示部分 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            <FormLabel>メニュー名</FormLabel>
            <p className="text-lg font-bold">{menuData.menuName}</p>
          </div>
          <div className="flex flex-col items-center">
            <FormLabel>価格</FormLabel>
            <p className="text-lg">{menuData.price}円</p>
          </div>
          <div className="flex flex-col items-center">
            <FormLabel>オーダー可否</FormLabel>
            <p className="text-lg">{menuData.orderFlg === 1 ? '可' : '不可'}</p>
          </div>
          <div className="flex flex-col items-center">
            <FormLabel>カテゴリー</FormLabel>
            <p className="text-lg">{menuData.menuType}</p>
          </div>
          <div className="flex flex-col items-center">
            <FormLabel>メニュー説明</FormLabel>
            <p className="text-lg">{menuData.detail}</p>
          </div>
        </div>
        
        <div className="flex justify-center w-full">
          <Button
            type="button" // フォーム送信ではないのでtype="button"
            onClick={handleDelete}
            className="
              bg-red-500 hover:bg-red-700 text-white font-bold
              py-3 px-8 rounded-lg text-lg tracking-wider
              transition-colors duration-200 ease-in-out
              w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12
              mx-auto
            " 
          >
            削除
          </Button>
        </div>

        <br />
        <Link href="/adminIndex" className="flex items-center text-4xl justify-center">
          <p className="flex items-center text-4xl justify-center">◆管理者ページ</p>
        </Link>
      </div>
    </Form>
  );
}