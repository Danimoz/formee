import { LLMProvider } from '@/interfaces';
import { ollama } from 'ollama-ai-provider';

export function getLLMProviders(provider: LLMProvider) {
  switch (provider) {
    case LLMProvider.OLLAMA:
      return {
        provider: ollama,
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
