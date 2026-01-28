import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // ESM形式に合わせて修正

const prisma = new PrismaClient();
async function main() {
  const menuType = [
    "コース",
    "前菜",
    "スープ",
    "パスタ",
    "肉料理",
    "魚料理",
    "デザート",
    "ワイン",
    "アルコール類",
    "ソフトドリンク類",
    "その他",
  ];
  for (const name of menuType) {
    await prisma.menuType.upsert({
      where: { t_name: name }, // t_nameがユニークであることを前提とする
      update: {},
      create: { t_name: name },
    });
  }

  const tables = [
    { table_name: "Amalfi (アマルフィ)", max_capacity: 2 }, // 海辺の美しい小都市
    { table_name: "Verona (ヴェローナ)", max_capacity: 2 }, // 「ロミオとジュリエット」の舞台
    { table_name: "Venezia (ヴェネツィア)", max_capacity: 4 }, // 水の都（中規模）
    { table_name: "Firenze (フィレンツェ)", max_capacity: 4 }, // 芸術の都（中規模）
    { table_name: "Roma (ローマ)", max_capacity: 6 }, // 永遠の都・最大都市
    { table_name: "Napoli (ナポリ)", max_capacity: 6 }, // 南イタリア最大の都市（活気ある6人席）
    { table_name: "Torino (トリノ)", max_capacity: 8 }, // 工業と歴史の街（ゆったりした8人席）
    { table_name: "Milano (ミラノ)", max_capacity: 10 }, // ファッションと経済の都（最大規模の10人席）
  ];
  for (const t of tables) {
    await prisma.table_loc.upsert({
      // ID（連番）ではなく、ユニークな「テーブル名」で存在チェックを行う
      where: { table_name: t.table_name },
      update: {}, // すでにある場合は更新しない（または必要に応じて更新内容を書く）
      create: t, // ない場合は新規作成
    });
  }

  // --- 3. テストユーザー (users) の作成 ---
  const hashedPassword = await bcrypt.hash("passwordSA", 10);
  const users = ["スミス", "アマンダ", "ドワイト", "ローリー"];
  for (const name of users) {
    await prisma.users.upsert({
      where: { name: name },
      update: {},
      create: {
        name: name,
        password: hashedPassword,
        created_at: new Date(),
      },
    });
  }

  // --- 4. 管理者 (admin) の作成 ---
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword && process.env.NODE_ENV === "production") {
    throw new Error("本番環境では SEED_ADMIN_PASSWORD の設定が必須です。");
  }

  // 開発環境なら "admin" をデフォルトにしても良いですが、指摘に従い変数化
  const passwordToHash = adminPassword || "admin";

  const hashedAdminPassword = await bcrypt.hash(passwordToHash, 10);

  await prisma.admin.upsert({
    where: { adm_name: "admin" },
    update: {
      password: hashedAdminPassword,
    },
    create: {
      adm_name: "admin",
      password: hashedAdminPassword,
      exp: "システム管理者", // exp（職務経験や説明）フィールドへの入力
      created_at: new Date(),
    },
  });

  // seed.ts の最後
  console.log("-----------------------------------------");
  console.log("✅ Seed process completed successfully!");
  console.log(" - Menu types & Menus");
  console.log(" - Table locations");
  console.log(" - Test users");
  console.log(" - Admin account");
  console.log("-----------------------------------------");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
