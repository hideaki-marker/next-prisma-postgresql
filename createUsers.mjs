// createUsers.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  try {
    // 新しいユーザーを作成
    const user1Name = 'スミス';
    const user1Password = 'passwordSA'; // 登録したい生パスワード
    const hashedPassword1 = await bcrypt.hash(user1Password, saltRounds); // パスワードをハッシュ化

    const newUser = await prisma.users.create({
      data: {
        name: user1Name, // ここに登録したい名前を入れます
        password: hashedPassword1, // ★ ハッシュ化されたパスワードを設定
        created_at: new Date(),     // 現在の日時を設定します
      },
    });
    console.log('新しいユーザーが登録されました:', newUser);

    const user2Name = 'アマンダ';
    const user2Password = 'passwordSA';
    const hashedPassword2 = await bcrypt.hash(user2Password, saltRounds);

    // 必要であれば、さらにユーザーを追加できます
    const anotherUser = await prisma.users.create({
      data: {
        name: user2Name,
        password: hashedPassword2, // ★ ハッシュ化されたパスワードを設定
        created_at: new Date(),
      },
    });
    console.log('別のユーザーが登録されました:', anotherUser);

  } catch (e) {
    console.error('ユーザーの登録中にエラーが発生しました:', e);
  } finally {
    await prisma.$disconnect(); // データベース接続を閉じます
  }
}

main();