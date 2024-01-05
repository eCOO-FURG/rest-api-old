/*
  Warnings:

  - You are about to drop the column `amount` on the `offers_products` table. All the data in the column will be lost.
  - Added the required column `price` to the `offers_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers_products" DROP COLUMN "amount",
ADD COLUMN     "price" TEXT NOT NULL;
