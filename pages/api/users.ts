// pages/api/users.ts
// PrismaClientのインポートパスを修正
import { PrismaClient } from '../../src/generated/prisma'; // <-- ここを修正
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // モデル名を 'users' (小文字) で呼び出す
      const users = await prisma.users.findMany(); // <-- ここを修正

      res.status(200).json(users);
    } catch (error: any) { // error を any 型として扱うか、適切な型定義をする
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}