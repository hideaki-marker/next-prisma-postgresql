-- CreateTable
CREATE TABLE "public"."table_loc" (
    "table_id" SERIAL NOT NULL,
    "table_name" VARCHAR(30),
    "max_capacity" INTEGER NOT NULL,

    CONSTRAINT "table_loc_pkey" PRIMARY KEY ("table_id")
);
