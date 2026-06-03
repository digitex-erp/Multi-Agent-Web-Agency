import { ChatOpenAI } from '@langchain/openai';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct';

export function getNimModel(): string {
  return process.env.NVIDIA_MODEL?.trim() || DEFAULT_MODEL;
}

export function isNimConfigured(): boolean {
  const key = process.env.NVIDIA_API_KEY?.trim();
  if (!key) return false;
  return !key.includes('MY_NVIDIA') && key !== 'nvapi-MY_NVIDIA_API_KEY';
}

/** LangChain ChatOpenAI pointed at Nvidia NIM (OpenAI-compatible) */
export function getNimChatModel(options?: {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}): ChatOpenAI | null {
  if (!isNimConfigured()) {
    console.warn('NVIDIA_API_KEY is not defined. LangChain agents will use fallback paths.');
    return null;
  }

  return new ChatOpenAI({
    model: getNimModel(),
    apiKey: process.env.NVIDIA_API_KEY,
    configuration: { baseURL: NVIDIA_BASE_URL },
    maxTokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.7,
    topP: options?.topP ?? 0.95,
  });
}
