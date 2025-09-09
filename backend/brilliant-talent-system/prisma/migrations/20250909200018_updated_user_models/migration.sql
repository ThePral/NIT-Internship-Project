/*
  Warnings:

  - Added the required column `birthDate` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalCode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nationalCode" TEXT NOT NULL;
