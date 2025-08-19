/*
  Warnings:

  - Added the required column `firstname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."universities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."minors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "req" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "minors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student_Priorities" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "minor_id" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "is_accepted" BOOLEAN,

    CONSTRAINT "Student_Priorities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "minors_name_key" ON "public"."minors"("name");

-- AddForeignKey
ALTER TABLE "public"."Student_Priorities" ADD CONSTRAINT "Student_Priorities_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student_Priorities" ADD CONSTRAINT "Student_Priorities_minor_id_fkey" FOREIGN KEY ("minor_id") REFERENCES "public"."minors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
