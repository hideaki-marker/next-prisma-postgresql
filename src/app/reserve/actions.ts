"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { TableLoc } from "@/type/db";

const prisma = new PrismaClient();

// ReserveFormから渡されるデータの型
type ReservationData = {
  userId: number;
  rsv_date: Date;
  person: number;
  table_id: number;
  courseId?: number | null; // ★追加：コース選択時
  orderData: { m_id: number; quantity: number }[]; // ★単品注文（席のみ予約時）
};

// 予約登録を実行するサーバーアクション
export async function createReservation(data: ReservationData) {
  // 1. 排他バリデーション（サーバー側でも念のためチェック）
  const hasCourse = !!data.courseId;
  const hasAlacarte = data.orderData.length > 0;

  if (hasCourse && hasAlacarte) {
    return {
      success: false,
      message: "コースと単品メニューを同時に予約することはできません。",
    };
  }
  try {
    // 2. トランザクション処理（予約と明細をセットで保存。片方が失敗したら両方取り消す）
    const result = await prisma.$transaction(async (tx) => {
      // A. 予約本体の作成
      const newReservation = await tx.reserve.create({
        data: {
          users: { connect: { id: data.userId } },
          rsv_date: data.rsv_date,
          person: data.person,
          table_loc: { connect: { table_id: data.table_id } },
        },
      });

      // B. 明細の保存（スキーマ上の明細テーブル名に合わせて調整してください）
      // ここでは仮に 'reserve_detail' というテーブル名と想定します
      if (hasCourse && data.courseId != null) {
        // コース予約の場合
        await tx.reserveDetail.create({
          data: {
            // reserve モデルとのリレーション項目名を確認してください（通常 rsv_id か reserve_id）
            rsv_id: newReservation.rsv_id,
            c_id: data.courseId,
            quantity: 1,
            // 単品(m_id)は空なので、この場合はコースIDだけを入れる
          },
        });
      } else if (hasAlacarte) {
        // 単品予約の場合（一括登録）
        await tx.reserveDetail.createMany({
          data: data.orderData.map((item) => ({
            rsv_id: newReservation.rsv_id,
            m_id: item.m_id,
            quantity: item.quantity,
          })),
        });
      }

      return newReservation;
    });

    console.log("予約・明細登録成功:", result);
    return { success: true, message: "予約が正常に完了しました。" };
  } catch (error) {
    console.error("予約登録失敗:", error);
    return { success: false, message: "登録中にエラーが発生しました。" };
  }
}

// 予約リストを取得する関数を新しく追加
// ★★★ 追加：getReservationList が返す予約オブジェクトの型を定義 ★★★
const reservationWithRelations = Prisma.validator<Prisma.reserveDefaultArgs>()({
  include: {
    users: {
      select: {
        name: true,
      },
    },
    table_loc: {
      select: {
        table_name: true,
        max_capacity: true,
      },
    },
  },
});

export type ReservationWithRelations = Prisma.reserveGetPayload<
  typeof reservationWithRelations
>;

type SuccessResult = {
  success: true;
  data: ReservationWithRelations[];
};

// 失敗時の型
type ErrorResult = {
  success: false;
  message: string;
};

// ★修正: getReservationListの戻り値の型を Union 型として export します
export type ReservationListResult = SuccessResult | ErrorResult;

export async function getReservationList(): Promise<ReservationListResult> {
  try {
    const reservations = await prisma.reserve.findMany({
      // ... (クエリ内容はそのまま) ...
      // クエリの内容は reservationWithRelations と一致しているため、型の保証にも役立ちます。
      include: {
        users: {
          select: {
            name: true,
          },
        },
        table_loc: {
          select: {
            table_name: true,
            max_capacity: true,
          },
        },
      },
    });

    // 成功した場合はデータを返却
    return { success: true, data: reservations };
  } catch (error) {
    console.error("予約リスト取得エラー:", error);
    // 失敗時も ReservationListResult 型に従ったオブジェクトを必ず返す
    return {
      success: false,
      message: "予約リストの取得中にエラーが発生しました。",
    };
  }
}

export async function deleteReservation(rsvId: number) {
  console.log(`予約ID ${rsvId} の削除を試行中...`);
  try {
    const deletedReservation = await prisma.reserve.delete({
      where: {
        rsv_id: rsvId, // rsv_id でレコードを特定して削除
      },
    });

    console.log("予約削除成功:", deletedReservation);
    // 成功時には成功メッセージを返します
    return { success: true, message: "予約を削除しました。" };
  } catch (error) {
    console.error("予約削除エラー:", error);
    // エラー発生時にはエラー情報を返します
    return { success: false, message: "予約削除中にエラーが発生しました。" };
  }
}

// table_locの全レコードを取得するサーバーアクション
export async function getAllTableLocs(): Promise<TableLoc[]> {
  try {
    const tables = await prisma.table_loc.findMany({
      select: {
        table_id: true,
        table_name: true,
        max_capacity: true,
      },
      orderBy: {
        table_id: "asc", // ID順にソート
      },
    });

    // 取得したレコードの配列をそのまま返します
    // table_nameがnullの場合は空文字列を返すようにすると安全です
    return tables.map((table) => ({
      table_id: table.table_id,
      table_name: table.table_name ?? "", // nullの場合を考慮
      max_capacity: table.max_capacity,
    }));
  } catch (error) {
    console.error("テーブルデータ取得エラー:", error);
    // エラー時は空の配列を返すか、例外をスローします（ここでは空配列を返す）
    return [];
  }
}
