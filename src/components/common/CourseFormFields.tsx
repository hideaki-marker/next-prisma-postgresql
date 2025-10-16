// components/common/CourseInsertForm.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // 仮定: チェックボックスコンポーネントを使用
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { insertCourseWithMenus, MenuSelectItem } from '@/app/course/actions';

type Props = {
    // ページコンポーネントから渡される全メニューデータ
    menuItems: MenuSelectItem[];
};

export default function CourseFormFields({ menuItems }: Props) {
    const router = useRouter();
    const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
    
    // メニュー選択のハンドラ
    const handleMenuSelect = (m_id: number, checked: boolean) => {
        setSelectedMenuIds(prev => 
            checked ? [...prev, m_id] : prev.filter(id => id !== m_id)
        );
    };

    // フォーム送信ハンドラ
    const handleSubmit = async (formData: FormData) => {
        const c_name = formData.get('c_name') as string;
        const priceStr = formData.get('price') as string;
        const detail = formData.get('detail') as string;
        const orderFlg = formData.get('orderFlg') === 'on';
        
        const price = parseInt(priceStr);

        if (!c_name || isNaN(price) || price <= 0) {
            toast.error('コース名と価格を正しく入力してください。');
            return;
        }

        const data = {
            c_name,
            price,
            orderFlg,
            detail: detail || null,
            t_id: 0, // 仮の値。サーバーアクション内でカテゴリIDを特定するのが理想
            selectedMenuIds: selectedMenuIds, // 選択したメニューIDの配列
        };

        const result = await insertCourseWithMenus(data);

        if (result.success) {
            toast.success(result.message);
            router.push('/courseList'); // 登録後、コース一覧ページなどへ遷移
        } else {
            toast.error(result.message);
        }
    };

    // メニューをカテゴリごとに分類 (表示用)
    const categorizedMenus = menuItems.reduce((acc, menu) => {
        const category = menu.t_name || 'その他';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(menu);
        return acc;
    }, {} as Record<string, MenuSelectItem[]>);


    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">コース基本情報</h2>

            {/* 1. コース名 (menuInsertと同じ構造) */}
            <div>
                <label htmlFor="c_name" className="block text-sm font-medium text-gray-700 mb-1">コース名</label>
                <Input type="text" id="c_name" name="c_name" required />
            </div>

            {/* 2. 価格 (menuInsertと同じ構造) */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">価格 (¥)</label>
                <Input type="number" id="price" name="price" min="1" required />
            </div>
            
            {/* 3. コメント/詳細 (menuInsertと同じ構造) */}
            <div>
                <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">コメント/詳細</label>
                <textarea id="detail" name="detail" rows={3} className="w-full border rounded-md p-2" />
            </div>

            {/* 4. オーダー可否 (menuInsertと同じ構造) */}
            <div className="flex items-center space-x-2">
                <Checkbox id="orderFlg" name="orderFlg" defaultChecked />
                <label htmlFor="orderFlg" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    オーダー可能
                </label>
            </div>

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 pt-4">コース構成メニュー (複数選択可)</h2>

            {/* 5. メニュー選択エリア (新規追加) */}
            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                {Object.entries(categorizedMenus).map(([t_name, menus]) => (
                    <div key={t_name}>
                        <h3 className="text-lg font-bold mb-2 text-indigo-700 border-b">{t_name}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {menus.map(menu => (
                                <div key={menu.m_id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`menu-${menu.m_id}`}
                                        checked={selectedMenuIds.includes(menu.m_id)}
                                        onCheckedChange={(checked) => handleMenuSelect(menu.m_id, !!checked)}
                                    />
                                    <label htmlFor={`menu-${menu.m_id}`} className="text-sm cursor-pointer">
                                        {menu.m_name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 6. 登録ボタン */}
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white text-lg py-3">
                コースを登録する
            </Button>
        </form>
    );
}