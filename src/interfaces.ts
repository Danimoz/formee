export enum LLMProvider {
  OPENAI = "OpenAI",
  ANTHROPIC = "Anthropic",
  OLLAMA = "Ollama",
}

export type AIFormSchema = {
  title: string
  description: string
  sections: FormSection[]
}

export interface FormSection {
  id: string
  title: string
  description: string
  fields: AIFormField[]
}

export interface AIFormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  visibility?: {
    dependsOn: string
    value: string | number | boolean
  }
  validations?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
  }
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface Conversation {
  id: string
  title: string
  userEmail: string
  messages: Message[]
  createdAt: Date
}