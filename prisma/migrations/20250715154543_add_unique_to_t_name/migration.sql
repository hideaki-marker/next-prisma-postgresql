/*
  Warnings:

  - A unique constraint covering the columns `[t_name]` on the table `menuType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menuType_t_name_key" ON "menuType"("t_name");
