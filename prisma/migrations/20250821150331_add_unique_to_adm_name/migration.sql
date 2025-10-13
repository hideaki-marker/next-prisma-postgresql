/*
  Warnings:

  - A unique constraint covering the columns `[adm_name]` on the table `admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admin_adm_name_key" ON "public"."admin"("adm_name");
