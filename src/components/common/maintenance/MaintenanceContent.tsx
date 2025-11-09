'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // 編集・削除ボタン用
import { toast } from 'sonner';

// サーバーアクションから型をインポート
import { 
    getMenusByType, 
    getCourseDetail, 
    MenuDetail, 
    CourseDetail 
} from '@/app/menuMaintenance/actions';


// 表示状態の型
type ContentState = {
    type: 'course' | 'menuType' | null;
    id: number | null;
    title: string;
    data: MenuDetail[] | CourseDetail | null;
    loading: boolean;
};

export default function MaintenanceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // URLからクエリを取得
    const queryType = searchParams?.get('type'); // 'course' or 'menuType'
    const queryId = searchParams?.get('id');     // ID (string)

    const [content, setContent] = useState<ContentState>({
        type: null,
        id: null,
        title: 'サイドバーから項目を選択してください',
        data: null,
        loading: false,
    });

    // クエリパラメータの変更を監視し、データを取得する
    useEffect(() => {
        if (!queryType || !queryId) {
            setContent(prev => ({ 
                ...prev, 
                type: null, 
                id: null, 
                title: 'サイドバーから項目を選択してください',
                data: null,
                loading: false,
            }));
            return;
        }

        const id = parseInt(queryId);
        if (isNaN(id)) return; // 無効なIDは無視

        setContent(prev => ({ 
            ...prev, 
            type: queryType as 'course' | 'menuType', 
            id: id, 
            loading: true,
            title: 'データを読み込み中...',
            data: null,
        }));

        async function fetchData() {
            if (queryType === 'course') {
                const courseData = await getCourseDetail(id);
                setContent(prev => ({
                    ...prev,
                    data: courseData,
                    title: courseData ? `コース: ${courseData.c_name}` : 'コースが見つかりません',
                    loading: false,
                }));
            } else if (queryType === 'menuType') {
                const menuData = await getMenusByType(id);
                const title = menuData.length > 0 
                    ? `分類: ${menuData[0].menuType.t_name} (${menuData.length}件)` 
                    : 'メニューが見つかりません';
                
                setContent(prev => ({
                    ...prev,
                    data: menuData,
                    title: title,
                    loading: false,
                }));
            }
        }

        fetchData();
    }, [queryType, queryId]);


    // -------------------------------------------------------------
    // ★★★★ 削除処理 (プレースホルダー) ★★★★
    // -------------------------------------------------------------
    const handleDelete = (itemType: 'course' | 'menu', itemId: number) => {
        // 実際にはここでサーバーアクションを呼び出し、DBから削除する
        toast.error(`[${itemType} ID: ${itemId}] の削除ロジックを実装してください。`);
    };

    // -------------------------------------------------------------
    // ★★★★ 表示レンダリングロジック ★★★★
    // -------------------------------------------------------------

    // 1. ロード中
    if (content.loading) {
        return <div className="text-center py-10 text-xl text-indigo-500">データを読み込み中...</div>;
    }
    
    // 2. 初期状態
    if (content.type === null) {
        return <div className="text-center py-20 text-gray-500 text-lg">{content.title}</div>;
    }


    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold border-b pb-2">{content.title}</h2>

            {/* コースの詳細表示 */}
            {content.type === 'course' && content.data && !Array.isArray(content.data) && (
                <CourseDisplay course={content.data as CourseDetail} handleDelete={handleDelete} router={router}/>
            )}

            {/* メニュー分類ごとのメニュー一覧表示 */}
            {content.type === 'menuType' && content.data && Array.isArray(content.data) && (
                <MenuTable menus={content.data as MenuDetail[]} handleDelete={handleDelete} router={router}/>
            )}

            {/* データなしの場合のメッセージ */}
            {(!content.data || (Array.isArray(content.data) && content.data.length === 0)) && (
                <div className="text-center py-10 text-gray-500">該当するデータが見つかりませんでした。</div>
            )}

        </div>
    );
}


// コース詳細表示コンポーネント (補助)
const CourseDisplay = ({ course, handleDelete, router }: 
    { course: CourseDetail,
      handleDelete: (t: 'course' | 'menu', id: number) => void,
      router: ReturnType<typeof useRouter>
  }) => (
    <div className="border p-6 rounded-lg shadow-md bg-white">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{course.c_name}</h3>
            <div className="space-x-2">
                <Button variant="outline" onClick={() => router.push(`/courseUpdate/${course.c_id}`)} className="text-sm">編集</Button>
                <Button variant="destructive" onClick={() => handleDelete('course', course.c_id)} className="text-sm">削除</Button>
            </div>
        </div>
        <p className="mb-2">価格: ¥{course.price.toLocaleString()}</p>
        <p className="mb-4 text-gray-600">詳細: {course.detail || '（詳細なし）'}</p>
        
        <h4 className="font-bold mt-4 border-t pt-2">構成メニュー</h4>
        <ul className="list-disc list-inside ml-4">
            {course.courseCtl.map((ctl, index) => (
                <li key={index}>{ctl.menu.m_name}</li>
            ))}
        </ul>
    </div>
);


// メニュー一覧テーブル表示コンポーネント (補助)
const MenuTable = ({ menus, handleDelete, router }: 
        { menus: MenuDetail[],
          handleDelete: (t: 'course' | 'menu', id: number) => void,
          router: ReturnType<typeof useRouter>
        }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b text-left">メニュー名</th>
                    <th className="py-2 px-4 border-b">価格</th>
                    <th className="py-2 px-4 border-b">オーダー可</th>
                    <th className="py-2 px-4 border-b">操作</th>
                </tr>
            </thead>
            <tbody>
                {menus.map(menu => (
                    <tr key={menu.m_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-center">{menu.m_id}</td>
                        <td className="py-2 px-4 border-b">{menu.m_name}</td>
                        <td className="py-2 px-4 border-b text-right">¥{menu.price.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-center">{menu.orderFlg ? '✅' : '❌'}</td>
                        <td className="py-2 px-4 border-b text-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/menuUpdate/${menu.m_id}`)}>編集</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete('menu', menu.m_id)}>削除</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);