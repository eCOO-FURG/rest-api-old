/*
  Warnings:

  - Added the required column `pricing` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PRICING" AS ENUM ('UNIT', 'WEIGHT');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "pricing" "PRICING" NOT NULL;
