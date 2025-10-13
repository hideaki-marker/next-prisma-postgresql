-- CreateTable
CREATE TABLE "public"."admin" (
    "adm_name" VARCHAR(30) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "exp" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adm_name","password")
);
