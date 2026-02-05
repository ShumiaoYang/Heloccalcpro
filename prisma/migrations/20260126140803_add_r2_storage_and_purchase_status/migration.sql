/*
  Warnings:

  - The `status` column on the `PdfPurchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "PdfPurchase" ADD COLUMN     "r2Key" TEXT,
ADD COLUMN     "r2Url" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "PdfPurchase_status_idx" ON "PdfPurchase"("status");

-- CreateIndex
CREATE INDEX "PdfPurchase_r2Key_idx" ON "PdfPurchase"("r2Key");
