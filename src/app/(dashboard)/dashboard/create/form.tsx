'use client'

import { generateForm } from "@/app/actions/generate-form"
import FormBuilderSkeleton from "@/components/form/form-builder-skeleton"
import { Badge } from "@/components/ui/badge"
import ChatInput from "@/components/ui/chat-input"
import { Message } from "@/interfaces"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function CreateForm({ provider }: { provider?: string }) {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { replace } = useRouter()

  async function handleGenerateForm() {
    if (!prompt.trim() || isLoading) return
    // Optimistically update the UI with user message
    setMessages((prev) => [...prev, { role: 'user', content: prompt }])

    try {
      setIsLoading(true)
      const schema = await generateForm(prompt)
      if (schema.error) {
        toast.error(schema.error)
        setMessages([])
        return
      }
      setPrompt('')
      replace(`/dashboard/edit/${schema.conversationId}?create=true`)
      console.log(schema)
    } catch (error) {
      // console.error(error)
      setMessages([])
      toast.error(`Failed to generate form: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  console.log('messages', messages)

  return (
    <>
      {messages?.length > 0 ? (
        <main className="md:container mx-4 md:mx-auto py-4">
          <section>
            {isLoading && <FormBuilderSkeleton justShowLastMessage={false} />}
          </section>
        </main>
      ) : (
        <main className="flex justify-center items-center min-h-[85dvh] w-full">
          <section className="w-full md:container mx-4 md:mx-auto space-y-4">
            <h2 className="text-3xl text-center font-bold">Create a Form</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Use natural language to describe the form you want to create. For example: &ldquo;Create a customer feedback
              survey that asks for ratings on service, quality, and overall satisfaction, and includes an open-ended
              comment section.&rdquo;
            </p>
            <ChatInput
              placeholder="Describe the Form you want to create"
              value={prompt}
              onChange={setPrompt}
              className="pr-16"
              onEnter={handleGenerateForm}
            />
            
            {!provider && (
              <div className="flex justify-center items-center mt-4">
                <Badge variant='destructive' className="text-base font-medium">
                  Please go to the Settings Page to set up your API Key and Model, so you can use
                </Badge>
              </div>
            )}
          </section>
        </main>
      )}
    </>
  )
}