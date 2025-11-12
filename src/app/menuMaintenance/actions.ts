'use server';

import  prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// 表示するメニュー詳細の型定義 (MenuTypeを含めた結合結果)
export type MenuDetail = Prisma.menuGetPayload<{
    include: {
        menuType: {
            select: { t_name: true }
        }
    }
}>;

// 表示するコース詳細の型定義 (Menuを含めた結合結果)
export type CourseDetail = Prisma.courseGetPayload<{
    include: {
        courseCtl: {
            include: {
                menu: {
                    select: { m_name: true }
                }
            }
        }
    }
}>;


/**
 * メニュー分類 (t_id) に基づいてメニュー一覧を取得するサーバーアクション
 * @param t_id ターゲットのメニュー分類ID
 */
export async function getMenusByType(t_id: number): Promise<MenuDetail[]> {
    try {
        const menus = await prisma.menu.findMany({
            where: { t_id: t_id },
            include: {
                menuType: {
                    select: { t_name: true }
                }
            },
            orderBy: { m_id: 'asc' }
        });
        return menus;
    } catch (error) {
        console.error("Failed to fetch menus by type:", error);
        return [];
    }
}


/**
 * コースID (c_id) に基づいてコース詳細を取得するサーバーアクション
 * @param c_id ターゲットのコースID
 */
export async function getCourseDetail(c_id: number): Promise<CourseDetail | null> {
    try {
        const course = await prisma.course.findUnique({
            where: { c_id: c_id },
            include: {
                // コースに含まれるメニューを courseCtl 経由で取得
                courseCtl: {
                    include: {
                        menu: {
                            select: { m_name: true }
                        }
                    }
                }
            }
        });
        return course;
    } catch (error) {
        console.error("Failed to fetch course detail:", error);
        return null;
    }
}