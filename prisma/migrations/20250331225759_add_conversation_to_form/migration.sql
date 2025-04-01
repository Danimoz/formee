/*
  Warnings:

  - You are about to drop the column `formId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_formId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "formId";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "conversationId" TEXT;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
