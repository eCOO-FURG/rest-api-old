/*
  Warnings:

  - Added the required column `status` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OFFER_STATUS" AS ENUM ('READY', 'ON_HOLD');

-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "status" "OFFER_STATUS" NOT NULL;
