/*
  Warnings:

  - You are about to drop the column `priority` on the `allocation_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."allocation_history" DROP COLUMN "priority",
ADD COLUMN     "acceptedPriority" INTEGER,
ALTER COLUMN "minorName" DROP NOT NULL,
ALTER COLUMN "minorCap" DROP NOT NULL;
