/*
  Warnings:

  - Added the required column `universityName` to the `allocation_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."allocation_history" ADD COLUMN     "universityName" TEXT NOT NULL;
