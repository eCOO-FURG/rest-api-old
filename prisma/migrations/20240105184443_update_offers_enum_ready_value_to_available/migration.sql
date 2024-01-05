/*
  Warnings:

  - The values [READY] on the enum `OFFER_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OFFER_STATUS_new" AS ENUM ('AVAILABLE', 'ON_HOLD');
ALTER TABLE "offers" ALTER COLUMN "status" TYPE "OFFER_STATUS_new" USING ("status"::text::"OFFER_STATUS_new");
ALTER TYPE "OFFER_STATUS" RENAME TO "OFFER_STATUS_old";
ALTER TYPE "OFFER_STATUS_new" RENAME TO "OFFER_STATUS";
DROP TYPE "OFFER_STATUS_old";
COMMIT;
