-- DropForeignKey
ALTER TABLE "reserveDetail" DROP CONSTRAINT "reserveDetail_rsv_id_fkey";

-- AddForeignKey
ALTER TABLE "reserveDetail" ADD CONSTRAINT "reserveDetail_rsv_id_fkey" FOREIGN KEY ("rsv_id") REFERENCES "reserve"("rsv_id") ON DELETE CASCADE ON UPDATE CASCADE;
