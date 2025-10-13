// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const menuType = [
        'コース',
        '前菜',
        'スープ',
        'パスタ',
        '肉料理',
        '魚料理',
        'デザート',
        'ワイン',
        'アルコール類',
        'ソフトドリンク類',
        'その他',
    ];
    for (const name of menuType) {
        await prisma.menuType.upsert({
            where: { t_name: name }, // t_nameがユニークであることを前提とする
            update: {},
            create: { t_name: name },
        });
    }
    console.log('Menu types seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
