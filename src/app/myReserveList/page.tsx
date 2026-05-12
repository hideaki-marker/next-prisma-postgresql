import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import UserReserveList from "@/components/common/reserve/UserReserveList";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error(
    "CRITICAL: JWT_SECRET environment variable is not set. Check your .env file.",
  );
}

export default async function MyReserveList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    userId = decoded.id;
  } catch (error) {
    console.error("JWT verification failed:", error);
    redirect("/login");
  }

  // 💡 スキーマに合わせてクエリを修正
  const reserves = await prisma.reserve.findMany({
    where: {
      id: userId, // スキーマ上のユーザーIDカラム名は 'id'
    },
    include: {
      table_loc: true, // テーブル情報
      details: {
        // 注文明細 (reserveDetail)
        include: {
          menu: true, // 単品メニュー
          course: true, // コース
        },
      },
    },
    orderBy: {
      rsv_date: "desc",
    },
  });

  // クライアントコンポーネントが扱いやすいように日付をシリアライズ
  // (Next.jsのServer Actions/PropsでDateオブジェクトを渡す際のエラー回避)
  const formattedReservations = reserves.map((rsv) => ({
    ...rsv,
    rsv_date: rsv.rsv_date.toISOString() || "",
    app_date: rsv.app_date.toISOString() || "",
    // details内のmenuやcourseのプロパティ名もスキーマに合わせる
    details: rsv.details.map((d) => ({
      quantity: d.quantity,
      menu: d.menu ? { m_name: d.menu.m_name } : null,
      course: d.course ? { c_name: d.course.c_name } : null,
    })),
  }));

  return (
    <main>
      {/* 1. 背景画像レイヤー */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[url('/NewCustomerRegistration.png')]">
        {/* 2. 重なり（オーバーレイ）: 画像を少し暗く or 白っぽくして文字を読みやすくする */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>
      <UserReserveList initialReservations={formattedReservations} />
    </main>
  );
}
