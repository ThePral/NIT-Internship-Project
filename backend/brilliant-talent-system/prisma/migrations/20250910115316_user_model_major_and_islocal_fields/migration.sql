/*
  Warnings:

  - You are about to drop the column `privilegedUniId` on the `allocation_runs` table. All the data in the column will be lost.
  - Added the required column `privilegedUniName` to the `allocation_runs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLocal` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `majorName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."allocation_runs" DROP COLUMN "privilegedUniId",
ADD COLUMN     "privilegedUniName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isLocal" BOOLEAN NOT NULL,
ADD COLUMN     "majorName" TEXT NOT NULL;
