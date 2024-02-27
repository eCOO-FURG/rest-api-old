-- CreateTable
CREATE TABLE "OneTimePassword" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "OneTimePassword_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OneTimePassword" ADD CONSTRAINT "OneTimePassword_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
