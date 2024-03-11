/*
  Warnings:

  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cycle_id` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_cycle_id_fkey";

-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "cycle_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "schedules";

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
