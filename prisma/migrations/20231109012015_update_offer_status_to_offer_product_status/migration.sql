/*
  Warnings:

  - You are about to drop the column `status` on the `offers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OFFER_PRODUCT_STATUS" AS ENUM ('APPROVED', 'DECLINED', 'PENDING');

-- AlterTable
ALTER TABLE "offerProducts" ADD COLUMN     "status" "OFFER_PRODUCT_STATUS" NOT NULL DEFAULT 'DECLINED';

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "status";

-- DropEnum
DROP TYPE "OFFER_STATUS";
