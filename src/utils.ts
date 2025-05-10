import { SupportedLanguage } from 'types';

export const checkIfLanguageSupported = (
  language: string
): language is SupportedLanguage => {
  return SupportedLanguage.includes(language as SupportedLanguage);
};

export interface WarodaiEntry {
  alt: string | null;
  reading: string;
  code: string;
  senses: string[];
}

export type WarodaiDictionary = Record<string, WarodaiEntry[]>;

let cachedDictionary: WarodaiDictionary | null = null;

export async function loadDictionary(): Promise<WarodaiDictionary> {
  if (cachedDictionary) return cachedDictionary;

  const res = await fetch('/warodai_txt/warodai_parsed.json');
  if (!res.ok) throw new Error('Failed to load warodai dictionary');
  const data = await res.json();
  cachedDictionary = data;
  return data;
}

export async function findWordDefinition(token: string): Promise<string | null> {
  const dict = await loadDictionary();

  const entries = dict[token];
  if (!entries || entries.length === 0) return null;

  return entries[0].senses.join('; ');
}
