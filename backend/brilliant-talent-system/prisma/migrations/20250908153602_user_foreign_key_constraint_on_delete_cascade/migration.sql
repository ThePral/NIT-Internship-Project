-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_universityId_fkey";

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
