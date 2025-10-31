-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserSubscription" ALTER COLUMN "updatedAt" DROP DEFAULT;
