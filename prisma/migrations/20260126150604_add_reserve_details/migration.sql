/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "admin" DROP CONSTRAINT "admin_pkey",
ADD COLUMN     "adm_id" SERIAL NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("adm_id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "reserveDetail" (
    "rd_id" SERIAL NOT NULL,
    "rsv_id" INTEGER NOT NULL,
    "m_id" INTEGER,
    "c_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reserveDetail_pkey" PRIMARY KEY ("rd_id")
);

-- AddForeignKey
ALTER TABLE "reserveDetail" ADD CONSTRAINT "reserveDetail_rsv_id_fkey" FOREIGN KEY ("rsv_id") REFERENCES "reserve"("rsv_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserveDetail" ADD CONSTRAINT "reserveDetail_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "menu"("m_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserveDetail" ADD CONSTRAINT "reserveDetail_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "course"("c_id") ON DELETE SET NULL ON UPDATE CASCADE;
