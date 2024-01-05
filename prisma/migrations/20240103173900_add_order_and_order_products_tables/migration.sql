/*
  Warnings:

  - You are about to drop the `offer_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('READY', 'ON_HOLD', 'DISPATCHED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "offer_products" DROP CONSTRAINT "offer_products_offer_id_fkey";

-- DropForeignKey
ALTER TABLE "offer_products" DROP CONSTRAINT "offer_products_product_id_fkey";

-- DropTable
DROP TABLE "offer_products";

-- CreateTable
CREATE TABLE "offers_products" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "offers_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" "ORDER_STATUS" NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_products" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offers_products" ADD CONSTRAINT "offers_products_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers_products" ADD CONSTRAINT "offers_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_products" ADD CONSTRAINT "orders_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
