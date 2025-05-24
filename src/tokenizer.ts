import kuromoji from 'kuromoji';

let tokenizerPromise: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> | null = null;

export function getTokenizer(): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: '/kuromoji' }).build((err, tokenizer) => {
        if (err) reject(err);
        else resolve(tokenizer);
      });
    });
  }
  return tokenizerPromise;
}