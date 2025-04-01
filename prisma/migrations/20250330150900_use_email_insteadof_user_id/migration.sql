/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LLMProviderSettings` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `LLMProviderSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_userId_fkey";

-- DropForeignKey
ALTER TABLE "LLMProviderSettings" DROP CONSTRAINT "LLMProviderSettings_userId_fkey";

-- DropIndex
DROP INDEX "Conversation_userId_idx";

-- DropIndex
DROP INDEX "Form_userId_idx";

-- DropIndex
DROP INDEX "LLMProviderSettings_userId_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LLMProviderSettings" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_userEmail_idx" ON "Conversation"("userEmail");

-- CreateIndex
CREATE INDEX "Form_userEmail_idx" ON "Form"("userEmail");

-- CreateIndex
CREATE INDEX "LLMProviderSettings_userEmail_idx" ON "LLMProviderSettings"("userEmail");

-- AddForeignKey
ALTER TABLE "LLMProviderSettings" ADD CONSTRAINT "LLMProviderSettings_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
