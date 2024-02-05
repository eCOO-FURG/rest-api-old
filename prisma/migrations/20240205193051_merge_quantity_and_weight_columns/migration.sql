/*
  Warnings:

  - You are about to drop the column `quantity` on the `offers_products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `offers_products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders_products` table. All the data in the column will be lost.
  - Added the required column `quantity_or_weight` to the `offers_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_or_weight` to the `orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers_products" DROP COLUMN "quantity",
DROP COLUMN "weight",
ADD COLUMN     "quantity_or_weight" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "orders_products" DROP COLUMN "quantity",
ADD COLUMN     "quantity_or_weight" DECIMAL(10,2) NOT NULL;
