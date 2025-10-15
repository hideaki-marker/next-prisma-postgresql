-- CreateTable
CREATE TABLE "public"."course" (
    "c_id" SERIAL NOT NULL,
    "c_name" VARCHAR(30) NOT NULL,
    "detail" TEXT,
    "orderFlg" BOOLEAN NOT NULL DEFAULT true,
    "price" INTEGER NOT NULL,
    "t_id" INTEGER NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("c_id")
);

-- CreateTable
CREATE TABLE "public"."courseCtl" (
    "c_id" INTEGER NOT NULL,
    "m_id" INTEGER NOT NULL,

    CONSTRAINT "courseCtl_pkey" PRIMARY KEY ("c_id","m_id")
);

-- AddForeignKey
ALTER TABLE "public"."course" ADD CONSTRAINT "course_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "public"."menuType"("t_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courseCtl" ADD CONSTRAINT "courseCtl_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "public"."course"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courseCtl" ADD CONSTRAINT "courseCtl_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "public"."menu"("m_id") ON DELETE RESTRICT ON UPDATE CASCADE;
