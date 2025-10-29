'use client';

import { useSearchParams, useRouter } from 'next/navigation';

// ★Propsの型定義（page.tsxからコピー）
type CourseItem = { c_id: number; c_name: string; };
type MenuTypeItem = { t_id: number; t_name: string | null;};

type Props = {
    allCourses: CourseItem[];
    allMenuTypes: MenuTypeItem[];
};

export default function Sidebar({ allCourses, allMenuTypes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 現在選択されている項目をURLから取得
    const currentType = searchParams?.get('type');
    const currentId = searchParams?.get('id');

    // 項目がクリックされたときのハンドラ
    const handleClick = (type: 'course' | 'menuType', id: number) => {
        // 新しいURLのクエリパラメータを作成
        const newParams = new URLSearchParams();
        newParams.set('type', type);
        newParams.set('id', id.toString());
        
        // ページ遷移（同じページ内でのクエリ更新）
        router.push(`/menuMaintenance?${newParams.toString()}`, { scroll: false });
    };
    
    // 選択状態をチェックするヘルパー関数
    const isActive = (type: 'course' | 'menuType', id: number) => {
        return currentType === type && currentId === id.toString();
    };

    return (
        <nav className="space-y-6">
            {/* コース一覧セクション */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">コース一覧</h3>
                <ul className="space-y-1">
                    {allCourses.map(course => (
                        <li key={course.c_id}>
                            <button
                                onClick={() => handleClick('course', course.c_id)}
                                className={`w-full text-left p-2 rounded-md transition-colors ${
                                    isActive('course', course.c_id) 
                                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                                    : 'hover:bg-gray-200'
                                }`}
                            >
                                {course.c_name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* メニュー分類セクション */}
            <div>
                <h3 className="text-lg font-semibold mb-2 pt-4 border-t mt-4 text-green-700">メニュー分類</h3>
                <ul className="space-y-1">
                    {allMenuTypes.map(type => (
                        <li key={type.t_id}>
                            <button
                                onClick={() => handleClick('menuType', type.t_id)}
                                className={`w-full text-left p-2 rounded-md transition-colors ${
                                    isActive('menuType', type.t_id) 
                                    ? 'bg-green-100 text-green-700 font-medium' 
                                    : 'hover:bg-gray-200'
                                }`}
                            >
                                {type.t_name ?? '名称未設定'} {/* nullの場合は「名称未設定」と表示 */}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}