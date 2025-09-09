-- CreateTable
CREATE TABLE "public"."allocation_history" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "minorName" TEXT NOT NULL,
    "minorReq" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allocation_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."allocation_history" ADD CONSTRAINT "allocation_history_runId_fkey" FOREIGN KEY ("runId") REFERENCES "public"."allocation_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
