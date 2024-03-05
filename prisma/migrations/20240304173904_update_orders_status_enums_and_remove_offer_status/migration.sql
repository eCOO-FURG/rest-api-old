/*
  Warnings:

  - The values [ON_HOLD] on the enum `ORDER_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `offer_product_id` on the `orders_products` table. All the data in the column will be lost.
  - Added the required column `offer_id` to the `orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ORDER_STATUS_new" AS ENUM ('READY', 'PAID', 'DISPATCHED', 'PENDING', 'CANCELED');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "ORDER_STATUS_new" USING ("status"::text::"ORDER_STATUS_new");
ALTER TYPE "ORDER_STATUS" RENAME TO "ORDER_STATUS_old";
ALTER TYPE "ORDER_STATUS_new" RENAME TO "ORDER_STATUS";
DROP TYPE "ORDER_STATUS_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "orders_products" DROP CONSTRAINT "orders_products_offer_product_id_fkey";

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "orders_products" DROP COLUMN "offer_product_id",
ADD COLUMN     "offer_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OFFER_STATUS";

-- AddForeignKey
ALTER TABLE "orders_products" ADD CONSTRAINT "orders_products_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
