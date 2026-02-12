// src/app/api/menu/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { commonMenuSchema } from "@/components/common/formSchemas";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: Request) {
  // --- 1. サーバー設定チェック (500エラー) ---
  if (!JWT_SECRET) {
    console.error("致命的エラー: JWT_SECRET が設定されていません。");
    return NextResponse.json(
      { message: "サーバー設定エラー" },
      { status: 500 },
    );
  }

  // --- 2. 認証チェック (401エラー) ---
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");

  if (!token) {
    return NextResponse.json({ message: "認証が必要です。" }, { status: 401 });
  }

  try {
    // ★重要：ここが「鍵」を回して本物か確かめる作業です
    jwt.verify(token.value, JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { message: "不正なセッションです。" },
      { status: 401 },
    );
  }

  // --- 3. バリデーション & 登録処理 ---
  try {
    // request.json() はここで1回だけ呼ぶ
    const rawBody = await request.json();

    // Zodでバリデーション
    const validationResult = commonMenuSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "入力内容に誤りがあります。",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    // 検証済みのきれいなデータを使用する
    const { menuName, price, orderFlg, menuType, detail, imageUrl } =
      validationResult.data;

    // --- DB操作 ---
    const foundMenuType = await prisma.menuType.findUnique({
      where: { t_name: menuType },
      select: { t_id: true },
    });

    if (!foundMenuType) {
      return NextResponse.json(
        { message: "指定されたカテゴリーが見つかりません。" },
        { status: 400 },
      );
    }

    const t_id = foundMenuType.t_id;
    const isOrderable = Boolean(orderFlg);

    const newMenu = await prisma.menu.create({
      data: {
        m_name: menuName,
        detail: detail,
        orderFlg: isOrderable,
        price: price,
        t_id: t_id,
        image_url: imageUrl,
      },
    });

    return NextResponse.json(
      { message: "メニューが正常に登録されました。", menu: newMenu },
      { status: 201 },
    );
  } catch (error) {
    console.error("メニュー登録エラー:", error);
    return NextResponse.json(
      { message: "メニュー登録に失敗しました。" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
