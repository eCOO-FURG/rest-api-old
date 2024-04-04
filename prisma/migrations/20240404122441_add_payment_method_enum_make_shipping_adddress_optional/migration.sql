/*
  Warnings:

  - Changed the type of `payment_method` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('ON_DELIVERY');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shipping_address" DROP NOT NULL,
DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PAYMENT_METHOD" NOT NULL;
