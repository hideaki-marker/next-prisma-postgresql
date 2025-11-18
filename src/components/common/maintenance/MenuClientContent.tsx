// src/components/common/maintenance/MenuClientContent.tsx

"use client"; // ★ クライアントコンポーネントであることを宣言！

import { useEffect, useState } from 'react';
import MaintenanceContent from './MaintenanceContent'; // メニューリストを表示するコンポーネント
// ... MenuUpdateForm を呼び出すための Dialog や Button などのインポート ...

interface MenuClientContentProps {
    initialMenus: any[]; // メニューリストの型に合わせてね
    initialMenuTypes: any[]; // メニュータイプの型に合わせてね
}

export default function MenuClientContent({ initialMenus, initialMenuTypes }: MenuClientContentProps) {
    
    const initialOptions = initialMenuTypes.map(t => t.t_name || '').filter(Boolean);
    const [menuTypeOptions, setMenuTypeOptions] = useState<string[]>(initialOptions); 
    
    // ★ ページの表示に使うメニューリストを管理する state
    const [menuList, setMenuList] = useState(initialMenus);
    
    // ページロード時にカテゴリを取得するロジック（そのまま移動）
    useEffect(() => {
        async function fetchMenuTypeOptions() {
            try {
                // サーバーから渡された initialMenuTypes を使う場合は、この fetch は不要になるよ！
                // ただし、ここでは string[] が期待されているので、型を合わせる変換が必要かも
                
                // ★ 今回は fetch のコードをそのまま生かすよ
                const response = await fetch('/api/menuType'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch menu types');
                }
                const data: string[] = await response.json();
                setMenuTypeOptions(data);
            } catch (error) {
                console.error("Error fetching menu types:", error);
            }
        }
        fetchMenuTypeOptions();
    }, []); 

    return (
        // MaintenanceContent の中身に、メニューのリストやモーダル呼び出しのロジックが入る
        <MaintenanceContent 
            menuList={menuList} 
            menuTypeOptions={menuTypeOptions}
        />
    );
}