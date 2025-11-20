// app/courseInsert/page.tsx (サーバーコンポーネント)
import prisma from '@/lib/prisma'; // ★ default export のため、このようにインポート
import CourseEditFormFields from '@/components/common/CourseEditFormFields';
import { getAllMenuForSelect, MenuSelectItem } from '@/app/course/actions'; 
// CourseEditFormFieldsで定義した型をインポートするか、ここで再定義
// type CourseData = { c_id: number; c_name: string; price: number; detail: string | null; orderFlg: boolean; t_id: number; };

async function CourseUpdatePage({ params }: { params: { c_id: string } }) {

    const courseId = parseInt(params.c_id);

    if (isNaN(courseId)) {
        return <div className="text-center text-red-500 my-10">無効なコースIDです。</div>;
    }

    try {
        // 1. 全メニューデータを取得 (MenuSelectItem[])
        const menuItems: MenuSelectItem[] = await getAllMenuForSelect();
        
        // 2. 編集対象のコース基本データを取得 (initialCourse)
        const initialCourse = await prisma.course.findUnique({
            where: { c_id: courseId },
        });

        if (!initialCourse) {
            return <div className="text-center text-red-500 my-10">コースが見つかりませんでした。</div>;
        }

        // 3. 既存の紐づきメニューIDを取得 (initialMenuIds)
        const courseCtl = await prisma.courseCtl.findMany({
            where: { c_id: courseId },
            select: { m_id: true }, // メニューIDのみを選択
        });

        const initialMenuIds = courseCtl.map(ctl => ctl.m_id);
    
   return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="flex justify-center mb-8">
                    <h1 className="font-bold text-4xl">コース編集 ({initialCourse.c_name})</h1>
                </div>

                {/* ★★★ 必須のPropsをすべて渡す ★★★ */}
                <CourseEditFormFields 
                    menuItems={menuItems} 
                    initialCourse={initialCourse} // 取得した基本データ
                    initialMenuIds={initialMenuIds} // 取得した紐づくID
                />
            </div>
        );
    } catch (error) {
        console.error("Failed to load course data for update:", error);
        return <div className="text-center text-red-500 my-10">データの読み込み中にエラーが発生しました。</div>;
    }
}

export default CourseUpdatePage;