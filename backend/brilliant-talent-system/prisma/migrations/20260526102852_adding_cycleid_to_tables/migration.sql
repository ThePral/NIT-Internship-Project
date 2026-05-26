/*
  Warnings:

  - Added the required column `cycleId` to the `acceptances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `allocation_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `allocation_runs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `minors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `student_priorities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `universities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."acceptances" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."allocation_history" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."allocation_runs" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."minors" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."student_priorities" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."universities" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."cycles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cycles_name_key" ON "public"."cycles"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."universities" ADD CONSTRAINT "universities_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."minors" ADD CONSTRAINT "minors_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_priorities" ADD CONSTRAINT "student_priorities_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."allocation_runs" ADD CONSTRAINT "allocation_runs_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptances" ADD CONSTRAINT "acceptances_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."allocation_history" ADD CONSTRAINT "allocation_history_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "public"."cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
