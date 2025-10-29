// app/course/actions.ts

'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 必要な型を定義
export type CourseData = {
  c_name: string;
  price: number;
  orderFlg: boolean;
  detail: string | null;
  t_id: number; // コースのカテゴリID（例: 'コース'メニュータイプ）

  // フォームから送られてくる選択されたメニューIDの配列
  selectedMenuIds: number[]; 
};

type UpdateCourseData = {
    c_id: number; // ★必須
    c_name: string;
    price: number;
    orderFlg: boolean;
    detail: string | null;
    t_id: number; // 既存の値を引き継ぐ
    selectedMenuIds: number[];
};

// Menuテーブルから取得するデータの型（SelectBox用）
export type MenuSelectItem = {
    m_id: number;
    m_name: string;
    t_name: string | null; // 該当メニューのカテゴリ名
};

// ----------------------------------------------------
// A. SelectBox表示用の全メニューデータ取得
// ----------------------------------------------------

export async function getAllMenuForSelect(): Promise<MenuSelectItem[]> {
    try {
        const menus = await prisma.menu.findMany({
            select: {
                m_id: true,
                m_name: true,
                menuType: {
                    select: {
                        t_name: true
                    }
                }
            },
            orderBy: {
                m_id: 'asc'
            }
        });

        return menus.map(m => ({
            m_id: m.m_id,
            m_name: m.m_name,
            t_name: m.menuType?.t_name ?? 'その他'
        }));
    } catch (error) {
        console.error('メニューデータ取得エラー:', error);
        return [];
    }
}


// ----------------------------------------------------
// B. コースとメニューをまとめて登録するトランザクション
// ----------------------------------------------------

export async function insertCourseWithMenus(data: CourseData) {
    try {
        // コースのカテゴリID（t_id）を固定値で取得または設定（例: 'コース'というカテゴリIDが 1 だと仮定）
        // 実際にはt_idを取得するロジックが必要です。ここでは仮に1とします。
        const courseTypeId = 1; 

        await prisma.$transaction(async (tx) => {
            // 1. courseテーブルにデータを登録
            const newCourse = await tx.course.create({
                data: {
                    c_name: data.c_name,
                    price: data.price,
                    orderFlg: data.orderFlg,
                    detail: data.detail,
                    t_id: courseTypeId, 
                },
                select: { c_id: true }
            });

            const c_id = newCourse.c_id;

            // 2. courseCtlテーブルにメニューIDを登録
            if (data.selectedMenuIds && data.selectedMenuIds.length > 0) {
                const courseCtlData = data.selectedMenuIds.map(m_id => ({
                    c_id: c_id,
                    m_id: m_id,
                }));

                await tx.courseCtl.createMany({
                    data: courseCtlData,
                    skipDuplicates: true, // 重複をスキップ
                });
            }
        });

        return { success: true, message: 'コースと関連メニューの登録が完了しました。' };

    } catch (error) {
        console.error('コース登録エラー:', error);
        return { success: false, message: 'コース登録中に予期せぬエラーが発生しました。' };
    }
}

// ★★★ 新しいサーバーアクション ★★★
export async function updateCourseWithMenus(data: UpdateCourseData): Promise<{ success: boolean; message: string }> {
    const prisma = new PrismaClient();
    try {
        await prisma.$transaction(async (tx) => {
            // 1. コースの基本情報を更新
            await tx.course.update({
                where: { c_id: data.c_id },
                data: {
                    c_name: data.c_name,
                    price: data.price,
                    detail: data.detail,
                    orderFlg: data.orderFlg,
                    // t_id は通常変更しないが、必要であれば更新
                    t_id: data.t_id, 
                },
            });

            // 2. 既存の courseCtl (コースとメニューの関連) をすべて削除
            await tx.courseCtl.deleteMany({
                where: { c_id: data.c_id },
            });

            // 3. 新しい選択メニューで courseCtl レコードを一括作成
            if (data.selectedMenuIds.length > 0) {
                const newCourseCtl = data.selectedMenuIds.map(m_id => ({
                    c_id: data.c_id,
                    m_id: m_id,
                }));

                await tx.courseCtl.createMany({
                    data: newCourseCtl,
                });
            }
        });

        return { success: true, message: `コース「${data.c_name}」を正常に更新しました。` };
    } catch (error) {
        console.error("Failed to update course:", error);
        return { success: false, message: 'コースの更新中にエラーが発生しました。' };
    } finally {
        await prisma.$disconnect();
    }
}