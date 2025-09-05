-- DropIndex
DROP INDEX "public"."users_points_idx";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "cohort" INTEGER;

-- CreateIndex
CREATE INDEX "users_cohort_points_idx" ON "public"."users"("cohort", "points");
