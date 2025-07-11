import {genkit, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let aiInstance: Genkit;

export function getAi(): Genkit {
  if (aiInstance) {
    return aiInstance;
  }

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('The GOOGLE_API_KEY environment variable is missing. Please check your environment configuration.');
  }

  aiInstance = genkit({
    plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
    model: 'googleai/gemini-2.0-flash',
  });

  return aiInstance;
}

export const ai = getAi();
