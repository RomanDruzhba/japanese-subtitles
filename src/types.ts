export interface DictionaryEntry {
  alt: string | null;
  reading: string;
  code: string;
  senses: string[];
}

export const SupportedLanguage = ['en', 'ru', 'jpn'] as const;
export type SupportedLanguage = typeof SupportedLanguage[number];

export interface Subtitle {
  src: string,
  srclang: SupportedLanguage,
  label: string,
  default?: boolean,
}

export interface TextTrackExtended extends TextTrack {
  isActive: 'true' | 'false',
}

export interface TextTrackExtendedList extends TextTrackList {
  [index: number]: TextTrackExtended;
}

interface TextTrackList {
  [Symbol.iterator](): IterableIterator<TextTrackExtended>;
}


