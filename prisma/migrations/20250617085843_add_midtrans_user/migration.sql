-- CreateTable
CREATE TABLE "Midtrans_User" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret_key" TEXT,
    "client_key" TEXT,

    CONSTRAINT "Midtrans_User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Midtrans_User_user_id_key" ON "Midtrans_User"("user_id");

-- AddForeignKey
ALTER TABLE "Midtrans_User" ADD CONSTRAINT "Midtrans_User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
