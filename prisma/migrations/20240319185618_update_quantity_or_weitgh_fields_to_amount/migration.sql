/*
  Warnings:

  - You are about to drop the column `quantity_or_weight` on the `offers_products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_or_weight` on the `orders_products` table. All the data in the column will be lost.
  - Added the required column `amount` to the `offers_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers_products" DROP COLUMN "quantity_or_weight",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders_products" DROP COLUMN "quantity_or_weight",
ADD COLUMN     "amount" INTEGER NOT NULL;
