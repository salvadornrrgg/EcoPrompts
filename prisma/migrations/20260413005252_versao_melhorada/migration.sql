/*
  Warnings:

  - A unique constraint covering the columns `[userId,promptId]` on the table `Eval` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `score` to the `Eval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_promptId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Eval" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "score" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Eval_userId_promptId_key" ON "Eval"("userId", "promptId");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
