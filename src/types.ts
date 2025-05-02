export type DictionaryEntry = [
  term: string,           // Основной термин (кандзи)
  reading: string,        // Чтение (фуригана)
  field2: string,         // Неизвестное поле 2
  field3: string,         // Неизвестное поле 3
  field4: number,         // Неизвестное поле 4 (число)
  translations: string[], // Варианты перевода
  field6: number,         // Неизвестное поле 6 (число)
  field7: string          // Неизвестное поле 7
];

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


