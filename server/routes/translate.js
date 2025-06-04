import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // важно!
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Japanese Subtitle Translator',
  },
});

export async function translateText(text, sourceLang, targetLang) {
  const prompt = `Переведи каждую из следующих строк с ${sourceLang} на ${targetLang}. Не добавляй ничего, кроме перевода. Строки разделены символом новой строки:\n${text}`;
  const chat = await openai.chat.completions.create({
    model: 'deepseek/deepseek-chat-v3-0324:free', // или другая модель
    messages: [{ role: 'user', content: prompt }],
  });

  return chat.choices[0].message.content.trim();
}