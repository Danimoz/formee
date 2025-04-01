import ConversationalForm from "@/components/form/conversational-form"
import { prisma } from "@/lib/prisma"

interface UserFormProps {
  params: Promise<{ formId: string }>
}

export async function generateMetadata({ params }: UserFormProps) {
  const { formId } = await params
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  })
  if (!form) return { title: 'Form not found' }
  return {
    title: form.title,
    description: form.description,
  }
}

export default async function UserForm({ params }: UserFormProps) {
  const { formId } = await params
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  })

  if (!form) return <div>Form not found</div>
  
  return (
    <ConversationalForm 
      formId={formId} 
      formFields={JSON.stringify(form.fields)} 
    />
  )
}