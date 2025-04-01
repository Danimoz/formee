import { auth } from "@/auth";
import FormBuilder from "@/components/form/form-builder";
import FormBuilderSkeleton from "@/components/form/form-builder-skeleton";
import { Conversation } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ formId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditForm({ params, searchParams }: PageProps) {
  const session = await auth()
  if (!session) redirect('/login')

  const { formId } = await params
  const searchParamsResolved = await searchParams
  const create = searchParamsResolved?.create === 'true'
 
  if (create) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: formId,
        userEmail: session?.user?.email!,
      },
      include: {
        messages: true,
      },
    })
  
    const lastMessage = conversation?.messages.at(-1)?.content
    if (!lastMessage) redirect('/dashboard/create')
    return (
      <Suspense fallback={<FormBuilderSkeleton justShowLastMessage={true} />}>
        <FormBuilder conversation={lastMessage} conversationId={formId} />
      </Suspense>
    )
  }

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      userEmail: session?.user?.email!,
    }
  })

  if (!form) redirect('/dashboard/create')

  return (
    <Suspense fallback={<FormBuilderSkeleton justShowLastMessage={true} />}>
      <FormBuilder conversation={JSON.stringify(form.fields)} formId={formId} conversationId={form.conversationId!}  />
    </Suspense>
  )

}