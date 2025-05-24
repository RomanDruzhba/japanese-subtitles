import express from 'express';
import multer from 'multer';
import kuromoji from 'kuromoji';
import { translateText } from './translate.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function parseVtt(vttContent) {
  return vttContent
    .split('\n\n')
    .filter(Boolean)
    .map(block => {
      const [time, ...textLines] = block.split('\n');
      return { time, text: textLines.join(' ') };
    });
}

function buildVtt(blocks) {
  return 'WEBVTT\n\n' + blocks.map(b => `${b.time}\n${b.text}`).join('\n\n');
}

function tokenizeJapanese(text) {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) return reject(err);
      const tokens = tokenizer.tokenize(text);
      resolve(tokens.map(t => t.surface_form).join(' '));
    });
  });
}

router.post('/transform', upload.single('file'), async (req, res) => {
  try {
    const { operation, sourceLang, targetLang } = req.body;
    const buffer = req.file?.buffer;

    if (!buffer) return res.status(400).send('Файл не загружен');

    const originalText = buffer.toString('utf-8');
    const blocks = parseVtt(originalText);

    const newBlocks = await Promise.all(
      blocks.map(async (block) => {
        if (operation === 'tokenize') {
          const tokenized = await tokenizeJapanese(block.text);
          return { ...block, text: tokenized };
        } else if (operation === 'translate') {
          const translated = await translateText(block.text, sourceLang, targetLang);
          return { ...block, text: translated };
        } else {
          throw new Error('Неизвестная операция');
        }
      })
    );

    const outputVtt = buildVtt(newBlocks);

    res.setHeader('Content-Disposition', 'attachment; filename="result.vtt"');
    res.setHeader('Content-Type', 'text/vtt');
    res.send(outputVtt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обработке субтитров');
  }
});

export default router;
