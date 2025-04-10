import { LLMProvider } from '@/interfaces';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic'

export function getLLMProviders(provider: LLMProvider, apiKey?: string, _model?: string) {
  switch (provider) {
    case LLMProvider.GOOGLE:
      const google = createGoogleGenerativeAI({
        ...(apiKey ? {apiKey} : {})
      })
      return {
        provider: google,
        model: 'gemini-2.0-flash'
      };
    case LLMProvider.OPENAI:
      const openai = createOpenAI({
        apiKey: apiKey,
      })
      return {
        provider: openai,
        model: 'gpt-4o'
      };
    case LLMProvider.ANTHROPIC:
      const anthropic = createAnthropic({
        apiKey: apiKey,
      })
      return {
        provider: anthropic,
        model: 'claude-3-5-sonnet-latest'
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
