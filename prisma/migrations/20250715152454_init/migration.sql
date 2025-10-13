/*
  Warnings:

  - You are about to drop the column `m_name` on the `menuType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "menuType" DROP COLUMN "m_name",
ADD COLUMN     "t_name" VARCHAR(30);
