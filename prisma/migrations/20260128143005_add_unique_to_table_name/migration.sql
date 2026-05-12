/*
  Warnings:

  - A unique constraint covering the columns `[table_name]` on the table `table_loc` will be added. If there are existing duplicate values, this will fail.
  - Made the column `table_name` on table `table_loc` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "table_loc" ALTER COLUMN "table_name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "table_loc_table_name_key" ON "table_loc"("table_name");
