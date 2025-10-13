-- CreateTable
CREATE TABLE "public"."reserve" (
    "rsv_id" SERIAL NOT NULL,
    "id" INTEGER NOT NULL,
    "rsv_date" TIMESTAMP(6) NOT NULL,
    "person" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,
    "app_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserve_pkey" PRIMARY KEY ("rsv_id")
);

-- AddForeignKey
ALTER TABLE "public"."reserve" ADD CONSTRAINT "reserve_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reserve" ADD CONSTRAINT "reserve_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."table_loc"("table_id") ON DELETE RESTRICT ON UPDATE CASCADE;
