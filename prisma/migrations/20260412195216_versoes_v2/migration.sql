-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_promptId_fkey";

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
