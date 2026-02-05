-- CreateTable
CREATE TABLE "HelocCalculation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "inputs" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelocCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribeType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "calculationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdfPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HelocCalculation_userId_idx" ON "HelocCalculation"("userId");

-- CreateIndex
CREATE INDEX "HelocCalculation_createdAt_idx" ON "HelocCalculation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_email_key" ON "EmailSubscription"("email");

-- CreateIndex
CREATE INDEX "EmailSubscription_email_idx" ON "EmailSubscription"("email");

-- CreateIndex
CREATE INDEX "EmailSubscription_subscribeType_idx" ON "EmailSubscription"("subscribeType");

-- CreateIndex
CREATE UNIQUE INDEX "PdfPurchase_stripePaymentId_key" ON "PdfPurchase"("stripePaymentId");

-- CreateIndex
CREATE INDEX "PdfPurchase_userId_idx" ON "PdfPurchase"("userId");

-- CreateIndex
CREATE INDEX "PdfPurchase_email_idx" ON "PdfPurchase"("email");

-- CreateIndex
CREATE INDEX "PdfPurchase_stripePaymentId_idx" ON "PdfPurchase"("stripePaymentId");

-- CreateIndex
CREATE INDEX "PdfPurchase_status_idx" ON "PdfPurchase"("status");

-- AddForeignKey
ALTER TABLE "HelocCalculation" ADD CONSTRAINT "HelocCalculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfPurchase" ADD CONSTRAINT "PdfPurchase_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "HelocCalculation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfPurchase" ADD CONSTRAINT "PdfPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
