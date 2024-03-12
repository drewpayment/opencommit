import { AiEngine } from '../engine/Engine';
import { api } from '../engine/openAi';
import { getConfig } from '../commands/config';
import { ollamaAi } from '../engine/ollama';
import { geminiAi } from '../engine/gemini';

export function getEngine(): AiEngine {
  const config = getConfig();
  
  const aiProvider = config?.OCO_AI_PROVIDER?.trim().toLowerCase();
  
  if (aiProvider === 'ollama') {
    return ollamaAi;
  } else if (aiProvider === 'gemini') {
    return geminiAi;
  }
  //open ai gpt by default
  return api;
}
