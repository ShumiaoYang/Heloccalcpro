/*
  Warnings:

  - The values [EMERGENCY_FUND] on the enum `ScenarioType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScenarioType_new" AS ENUM ('DEBT_CONSOLIDATION', 'HOME_RENOVATION', 'CREDIT_OPTIMIZATION', 'CONTINGENT_LIQUIDITY', 'INVESTMENT');
ALTER TABLE "HelocCalculation" ALTER COLUMN "scenario" TYPE "ScenarioType_new" USING ("scenario"::text::"ScenarioType_new");
ALTER TYPE "ScenarioType" RENAME TO "ScenarioType_old";
ALTER TYPE "ScenarioType_new" RENAME TO "ScenarioType";
DROP TYPE "public"."ScenarioType_old";
COMMIT;

-- AlterTable
ALTER TABLE "PdfPurchase" ADD COLUMN     "isFreePromo" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PrimeRate" (
    "id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrimeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrimeRate_effectiveDate_idx" ON "PrimeRate"("effectiveDate");

-- CreateIndex
CREATE INDEX "PdfPurchase_isFreePromo_idx" ON "PdfPurchase"("isFreePromo");
