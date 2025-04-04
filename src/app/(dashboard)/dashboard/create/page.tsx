import { auth } from "@/auth";
import CreateForm from "./form";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CreatePage(){
  const session = await auth()
  if (!session) redirect('/login')
  
  const provider = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { LLMProviderSettings: true }
  })

  return (
    <CreateForm provider={provider?.LLMProviderSettings[0].providerName} />
  )
}