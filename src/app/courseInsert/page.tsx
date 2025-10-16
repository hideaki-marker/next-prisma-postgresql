// app/courseInsert/page.tsx (サーバーコンポーネント)

import CourseInsertForm from '@/components/common/CourseFormFields';
import { getAllMenuForSelect, MenuSelectItem } from '@/app/course/actions'; 

async function CourseInsertPage() {
    // サーバーサイドでメニューデータを取得
    const menuItems: MenuSelectItem[] = await getAllMenuForSelect();
    
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex justify-center mb-8">
                <h1 className="font-bold text-4xl">コース登録</h1>
            </div>

            {/* 取得したメニューデータをフォームに渡す */}
            <CourseInsertForm menuItems={menuItems} />
        </div>
    );
}

export default CourseInsertPage;