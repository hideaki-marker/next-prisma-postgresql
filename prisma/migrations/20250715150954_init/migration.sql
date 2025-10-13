-- CreateTable
CREATE TABLE "menu" (
    "m_id" SERIAL NOT NULL,
    "m_name" VARCHAR(100) NOT NULL,
    "detail" TEXT,
    "orderFlg" BOOLEAN DEFAULT true,
    "price" INTEGER NOT NULL,
    "t_id" SMALLINT NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("m_id")
);

-- CreateTable
CREATE TABLE "menuType" (
    "t_id" SMALLSERIAL NOT NULL,
    "m_name" VARCHAR(30),

    CONSTRAINT "menuType_pkey" PRIMARY KEY ("t_id")
);

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "menuType"("t_id") ON DELETE RESTRICT ON UPDATE CASCADE;
