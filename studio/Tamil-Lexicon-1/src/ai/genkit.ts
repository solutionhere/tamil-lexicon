import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('The GOOGLE_API_KEY environment variable is missing. Please check your environment configuration.');
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
