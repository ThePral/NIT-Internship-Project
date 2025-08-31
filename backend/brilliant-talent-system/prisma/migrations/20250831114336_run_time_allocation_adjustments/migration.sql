/*
  Warnings:

  - You are about to drop the `Student_Priorities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `universities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grade` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Student_Priorities" DROP CONSTRAINT "Student_Priorities_minor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student_Priorities" DROP CONSTRAINT "Student_Priorities_student_id_fkey";

-- AlterTable
ALTER TABLE "public"."minors" ALTER COLUMN "req" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."universities" ALTER COLUMN "grade" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "grade" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "universityId" INTEGER NOT NULL,
ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL,
ALTER COLUMN "points" DROP NOT NULL,
ALTER COLUMN "points" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."Student_Priorities";

-- CreateTable
CREATE TABLE "public"."student_priorities" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "minorId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "isAccepted" BOOLEAN,

    CONSTRAINT "student_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."allocation_runs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "privilegedUniId" INTEGER NOT NULL,
    "cohortPolicy" TEXT NOT NULL,

    CONSTRAINT "allocation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."acceptances" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "minorId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "cohort" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_priorities_minorId_idx" ON "public"."student_priorities"("minorId");

-- CreateIndex
CREATE UNIQUE INDEX "student_priorities_studentId_priority_key" ON "public"."student_priorities"("studentId", "priority");

-- CreateIndex
CREATE INDEX "acceptances_minorId_idx" ON "public"."acceptances"("minorId");

-- CreateIndex
CREATE UNIQUE INDEX "acceptances_runId_studentId_key" ON "public"."acceptances"("runId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "universities_name_key" ON "public"."universities"("name");

-- CreateIndex
CREATE INDEX "users_points_idx" ON "public"."users"("points");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_priorities" ADD CONSTRAINT "student_priorities_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_priorities" ADD CONSTRAINT "student_priorities_minorId_fkey" FOREIGN KEY ("minorId") REFERENCES "public"."minors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptances" ADD CONSTRAINT "acceptances_runId_fkey" FOREIGN KEY ("runId") REFERENCES "public"."allocation_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptances" ADD CONSTRAINT "acceptances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptances" ADD CONSTRAINT "acceptances_minorId_fkey" FOREIGN KEY ("minorId") REFERENCES "public"."minors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
