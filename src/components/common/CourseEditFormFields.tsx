// components/common/CourseInsertForm.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // 仮定: チェックボックスコンポーネントを使用
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateCourseWithMenus, // ★新規作成する更新用アクション
     MenuSelectItem } from '@/app/course/actions';

     // ★★★ 1. 新しい型定義の追加 ★★★
// 編集対象のコースの基本データ型を定義 (PrismaのCourseモデルのサブセット)
type CourseData = {
    c_id: number;
    c_name: string;
    price: number;
    detail: string | null;
    orderFlg: boolean;
    t_id: number;
};

type Props = {
    // ページコンポーネントから渡される全メニューデータ
    menuItems: MenuSelectItem[];
    // ★編集用に追加: 既存のコースデータ
    initialCourse: CourseData;
    // ★編集用に追加: 既存のコースに紐づいているメニューIDの配列
    initialMenuIds: number[];
};

export default function CourseEditFormFields({ menuItems, initialCourse, initialMenuIds }: Props) {
    const router = useRouter();
    // ★★★ 2. Stateの初期化をPropsから行う ★★★
    // 既存の選択済みメニューIDでStateを初期化
    const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>(initialMenuIds);
    
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
        // Checkboxがチェックされていない場合、FormDataにはキーが含まれないため、
        // initialCourse.orderFlg をデフォルトとして使用するか、フォームにhiddenフィールドを追加
        const orderFlg = formData.get('orderFlg') === 'on'; 
        
        const price = parseInt(priceStr);

        if (!c_name || isNaN(price) || price <= 0) {
            toast.error('コース名と価格を正しく入力してください。');
            return;
        }

        const data = {
            c_id: initialCourse.c_id, // ★編集には c_id が必須
            c_name,
            price,
            orderFlg,
            detail: detail || null,
            t_id: initialCourse.t_id ?? 0, // 既存の t_id を引き継ぐ
            selectedMenuIds: selectedMenuIds,
        };

        // ★★★ 処理を更新用のアクションに切り替える ★★★
        const result = await updateCourseWithMenus(data);

        if (result.success) {
            toast.success(result.message);
            router.push('/courseList');
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

            {/* 1. コース名: defaultValueを設定 */}
            <div>
                <label htmlFor="c_name" className="block text-sm font-medium text-gray-700 mb-1">コース名</label>
                <Input type="text" id="c_name" name="c_name" required defaultValue={initialCourse.c_name} /> 
            </div>

            {/* 2. 価格: defaultValueを設定 */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">価格 (¥)</label>
                <Input type="number" id="price" name="price" min="1" required defaultValue={initialCourse.price} />
            </div>
            
            {/* 3. コメント/詳細: defaultValueを設定 */}
            <div>
                <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">コメント/詳細</label>
                {/* textarea の初期値は value ではなく children/defaultValue で設定 */}
                <textarea 
                    id="detail" 
                    name="detail" 
                    rows={3} 
                    className="w-full border rounded-md p-2" 
                    defaultValue={initialCourse.detail ?? ''} // nullの場合は空文字列
                />
            </div>

            {/* 4. オーダー可否: defaultCheckedをinitialCourse.orderFlgで制御 */}
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="orderFlg" 
                    name="orderFlg" 
                    defaultChecked={initialCourse.orderFlg} 
                />
                <label htmlFor="orderFlg" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    オーダー可能
                </label>
            </div>

           {/* 5. メニュー選択エリア: 選択状態はselectedMenuIdsのStateで自動的に反映される */}
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 pt-4">コース構成メニュー (複数選択可)</h2>

            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                {Object.entries(categorizedMenus).map(([t_name, menus]) => (
                    <div key={t_name}>
                        <h3 className="text-lg font-bold mb-2 text-indigo-700 border-b">{t_name}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {menus.map(menu => (
                                <div key={menu.m_id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`menu-${menu.m_id}`}
                                        checked={selectedMenuIds.includes(menu.m_id)} // Stateを参照
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

            {/* 6. 更新ボタン */}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3">
                コースを更新する
            </Button>
        </form>
    );
}