-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "formId" TEXT;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
