/*
  Warnings:

  - You are about to drop the `offerProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offerProducts" DROP CONSTRAINT "offerProducts_offer_id_fkey";

-- DropForeignKey
ALTER TABLE "offerProducts" DROP CONSTRAINT "offerProducts_product_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "type_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "offerProducts";

-- DropEnum
DROP TYPE "OFFER_PRODUCT_STATUS";

-- CreateTable
CREATE TABLE "products_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "products_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_products" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "offer_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_types_name_key" ON "products_types"("name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "products_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_products" ADD CONSTRAINT "offer_products_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_products" ADD CONSTRAINT "offer_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
