-- CreateTable (safe version that won't fail if table exists)
CREATE TABLE IF NOT EXISTS "PrimeRate" (
    "id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrimeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (safe version)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE indexname = 'PrimeRate_effectiveDate_idx'
    ) THEN
        CREATE INDEX "PrimeRate_effectiveDate_idx" ON "PrimeRate"("effectiveDate");
    END IF;
END $$;
