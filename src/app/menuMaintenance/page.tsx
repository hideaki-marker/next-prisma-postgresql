import prisma from '@/lib/prisma';
import Sidebar from '@/components/common/maintenance/Sidebar';
import MaintenanceContent from '@/components/common/maintenance/MaintenanceContent'; // ★後で作成

// サイドバーで表示するデータを取得
async function getMasterData() {
    // 1. 全コース一覧（サイドバー用）
    const allCourses = await prisma.course.findMany({
        select: {
            c_id: true,
            c_name: true,
        },
        orderBy: { c_id: 'asc' },
    });

    // 2. 全メニュー分類一覧（サイドバー用）
    const allMenuTypes = await prisma.menuType.findMany({
        select: {
            t_id: true,
            t_name: true,
        },
        orderBy: { t_id: 'asc' },
    });
    
    return { allCourses, allMenuTypes };
}


export default async function MenuMaintenancePage() {
    // サーバーサイドでデータ取得
    const { allCourses, allMenuTypes } = await getMasterData();

    return (
        <div className="flex min-h-screen">
            {/* 1. サイドバーエリア */}
            <div className="w-64 bg-gray-50 border-r p-4 sticky top-0 h-screen overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">管理者メニュー</h1>
                {/* Sidebarコンポーネントにマスターデータを渡す */}
                <Sidebar 
                    allCourses={allCourses} 
                    allMenuTypes={allMenuTypes} 
                />
            </div>

            {/* 2. メインコンテンツエリア */}
            <div className="flex-1 p-8">
                <MaintenanceContent />
            </div>
        </div>
    );
}