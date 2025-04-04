import { LLMProvider } from '@/interfaces';
import { ollama } from 'ollama-ai-provider';
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

export function getLLMProviders(provider: LLMProvider, apiKey?: string, model?: string) {
  switch (provider) {
    case LLMProvider.OLLAMA:
      return {
        provider: ollama,
        model: model
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
