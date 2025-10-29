import  prisma  from '@/lib/prisma';
import MenuUpdateForm from '@/components/common/menu/MenuUpdateForm';

// ★ クライアントコンポーネントが期待する MenuData 型を定義 (仮)
// 実際には MenuUpdateForm.tsx からインポートするか、ここで定義が必要です
type InitialMenuData = {
    id: string; // m_id
    menuName: string; // m_name
    price: number;
    orderFlg: number; // 0 or 1
    menuType: string; // t_name
    detail: string | undefined;
};

// ★ APIルート（app/api/menu/[id]/route.ts）のロジックをここに移植し、直接DBから取得します

export default async function MenuUpdatePage({ params }: { params: { m_id: string } }) {
    const menuId = parseInt(params.m_id);

    if (isNaN(menuId)) {
        return <div className="text-center text-red-500 my-10">無効なメニューIDです。</div>;
    }

    try {
        // 1. 既存メニューデータの取得
        const menu = await prisma.menu.findUnique({
            where: { m_id: menuId },
            include: { menuType: { select: { t_name: true } } }
        });

        if (!menu) {
            return <div className="text-center text-red-500 my-10">メニューが見つかりませんでした。</div>;
        }

        // 2. 全メニュータイプオプションの取得
        const menuTypeData = await prisma.menuType.findMany({
            select: { t_name: true }
        });
        const menuTypeOptions = menuTypeData.map(t => t.t_name).filter((name): name is string => name !== null);

        // 3. クライアントコンポーネントの期待形式に変換 (APIと同じロジック)
        const initialData: InitialMenuData = {
            id: menu.m_id.toString(),
            menuName: menu.m_name,
            price: menu.price,
            orderFlg: menu.orderFlg ? 1 : 0,
            menuType: menu.menuType?.t_name || '', // 紐づくカテゴリ名
            detail: menu.detail || undefined,
        };

        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <MenuUpdateForm 
                    initialData={initialData} 
                    menuTypeOptions={menuTypeOptions}
                />
            </div>
        );
    } catch (error) {
        console.error("Failed to load menu data:", error);
        return <div className="text-center text-red-500 my-10">データの読み込み中にエラーが発生しました。</div>;
    }
}