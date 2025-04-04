/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import {  AIFormSchema, LLMProvider } from "@/interfaces"
import { refinedPrompt, systemPrompt } from "@/lib/constants"
import { getLLMProviders } from "@/lib/llm-providers"
import { prisma } from "@/lib/prisma"
import { extractJSON } from "@/lib/utils"
import { generateText } from 'ai'
import { auth } from "@/auth"

export async function generateForm(userPrompt: string, conversationId?: string) {
  const session = await auth()
  if (!session)  return { error: "User not authenticated" }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      include: { LLMProviderSettings: true }
    })
    const { provider, model: modelName  } = getLLMProviders(user?.LLMProviderSettings[0].providerName as LLMProvider, user?.LLMProviderSettings[0].LLMProviderKey, user?.LLMProviderSettings[0].modelName as string)

    if (!conversationId) {
      const { text } = await generateText({
        model: provider(modelName as string),
        prompt: `${systemPrompt} ${userPrompt}`,
      })
      const jsonData = extractJSON(text)
      const newConversation = await prisma.conversation.create({
        data: {
          title: jsonData.title,
          userEmail: session?.user?.email!,
          messages: {
            create: [
              { role: 'user', content: userPrompt },
              { role: 'assistant', content: JSON.stringify(jsonData) },
            ],
          }
        },
      });
      return { data: jsonData, conversationId: newConversation.id };
    } else {
      const previousMessages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 5,
      });
      const conversationHistory = previousMessages.map((message) => `${message.role}: ${message.content}`).join('\n')
      const systemConversationHistory = `${systemPrompt} ${conversationHistory}`
      const refinedSystemPrompt = `${systemConversationHistory} ${refinedPrompt}`
    
      const { text } = await generateText({
        model: provider(modelName as string),
        prompt: `${refinedSystemPrompt} ${userPrompt}`,
      })
      const jsonData = extractJSON(text)
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: {
            create: [
              { role: 'user', content: userPrompt },
              { role: 'assistant', content: JSON.stringify(jsonData) },
            ],
          },
        },
      });
      return { data: jsonData, conversationId };
    }

  } catch (error) {
    return { error: `Failed to generate form: ${error}` }
  }
}

export async function saveForm(formData: AIFormSchema, conversationId: string) {
  const session = await auth()
  if (!session) return { error: "User not authenticated" }
  let form;

  try {
    const existingForm = await prisma.form.findFirst({
      where: { conversationId },
    })
    if (existingForm) {
      form = await prisma.form.update({
        where: { id: existingForm.id },
        data: {
          title: formData.title,
          description: formData.description,
          fields: JSON.parse(JSON.stringify(formData)),
        },
      })
    } else {
      form = await prisma.form.create({
        data: {
          title: formData.title,
          description: formData.description,
          fields: JSON.parse(JSON.stringify(formData)),
          conversationId,
          userEmail: session?.user?.email as string
        },
      })
    }
    return { success: true, formId: form.id }
  } catch (error) {
    console.error("Error saving form:", error)
    return { error: "Failed to save form" }
  }
}

export async function submitForm(formId: string, formData: Record<string, any>) {
  try {
     await prisma.formResponse.create({
      data: {
        formId,
        response: JSON.parse(JSON.stringify(formData)),
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Error submitting form:", error)
    return { error: "Failed to submit form" }
  }
}

export async function saveUserSettings(values: {
  llmProvider: string;
  apiKey: string;
  model: string;
}){
  const session = await auth()
  if (!session) return { error: "User not authenticated" }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email as string },
    })
    if (!user) return { error: "User not found" }

    const existingSetting = await prisma.lLMProviderSettings.findFirst({
      where: { userEmail: session?.user?.email as string }
    })
    if (existingSetting) {
      await prisma.lLMProviderSettings.update({
        where: { id: existingSetting.id },
        data: {
          LLMProviderKey: values.apiKey,
          modelName: values?.model,
          providerName: values.llmProvider          
        }
      })
      return { success: true, message: 'Successfully Updated' }
    }
    await prisma.lLMProviderSettings.create({
      data: {
        LLMProviderKey: values.apiKey,
        modelName: values?.model,
        providerName: values.llmProvider,
        userEmail: session?.user?.email as string
      }
    })
    return { success: true, message: 'Successfully Created' }
  } catch (error) {
    console.error("Error saving user settings:", error)
    return { error: "Failed to save user settings" }
  }
}