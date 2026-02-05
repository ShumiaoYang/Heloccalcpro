-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('DEBT_CONSOLIDATION', 'HOME_RENOVATION', 'CREDIT_OPTIMIZATION', 'EMERGENCY_FUND', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "AiAnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "HelocCalculation" ADD COLUMN "scenario" "ScenarioType",
ADD COLUMN "aiAnalysisRaw" JSONB,
ADD COLUMN "version" TEXT NOT NULL DEFAULT '1.0';

-- AlterTable
ALTER TABLE "PdfPurchase" ADD COLUMN "aiAnalysisStatus" "AiAnalysisStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "aiAnalysisError" TEXT,
ADD COLUMN "accessToken" TEXT,
ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PdfPurchase_accessToken_key" ON "PdfPurchase"("accessToken");
