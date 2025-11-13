//コーステーブル
export type Course = {
    c_id: number;
    c_name: string;
    price: number;
    detail: string | null;
    orderFlg: boolean;
    t_id: number;
};

//座席表テーブル
export type TableLoc = {
    table_id: number;
    table_name: string | null;
    max_capacity: number;
};

//メニューアップデート用
export type InitialMenuData = {
    id: string; // m_id
    menuName: string; // m_name
    price: number;
    orderFlg: number; // 0 or 1
    menuType: string; // t_name
    detail: string | undefined;
};