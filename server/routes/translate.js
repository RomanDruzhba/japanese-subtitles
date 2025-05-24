import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateText(text, sourceLang, targetLang) {
  const prompt = `Переведи следующий текст с ${sourceLang} на ${targetLang}: ${text}`;
  const chat = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return chat.choices[0].message.content.trim();
}
