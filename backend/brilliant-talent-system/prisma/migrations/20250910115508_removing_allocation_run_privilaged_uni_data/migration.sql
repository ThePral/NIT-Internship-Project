/*
  Warnings:

  - You are about to drop the column `privilegedUniName` on the `allocation_runs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."allocation_runs" DROP COLUMN "privilegedUniName";
