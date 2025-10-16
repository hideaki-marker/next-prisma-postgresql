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