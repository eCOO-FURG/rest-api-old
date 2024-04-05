-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'PRODUCER', 'USER');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "roles" "ROLE"[] DEFAULT ARRAY['USER']::"ROLE"[];
