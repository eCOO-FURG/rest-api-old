/*
  Warnings:

  - Added the required column `offer_product_id` to the `orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders_products" ADD COLUMN     "offer_product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders_products" ADD CONSTRAINT "orders_products_offer_product_id_fkey" FOREIGN KEY ("offer_product_id") REFERENCES "offers_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
