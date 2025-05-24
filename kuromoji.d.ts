declare module 'kuromoji' {
  export interface IpadicFeatures {
    word_id: number;
    word_type: string;
    word_position: number;
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading: string;
    pronunciation: string;
  }

  export interface Tokenizer<T = IpadicFeatures> {
    tokenize(text: string): Array<T & { word_position: number }>;
  }

  export function builder(options: { dicPath: string }): {
    build(
      callback: (err: Error | null, tokenizer: Tokenizer) => void
    ): void;
  };
}
