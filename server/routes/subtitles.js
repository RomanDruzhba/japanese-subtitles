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

// Разделение массива блоков на чанки фиксированного размера
function chunkBlocks(blocks, chunkSize) {
  const chunks = [];
  for (let i = 0; i < blocks.length; i += chunkSize) {
    chunks.push(blocks.slice(i, i + chunkSize));
  }
  return chunks;
}

function parseTranslatedVttBlocks(translatedText) {
  return translatedText
    .split('\n\n')
    .map((block) => {
      const [time, ...lines] = block.split('\n');
      return { time, text: lines.join(' ') };
    })
    .filter(b => b.time && b.text);
}

router.post('/transform', upload.single('file'), async (req, res) => {
  try {
    const { operation, sourceLang, targetLang } = req.body;
    const buffer = req.file?.buffer;

    if (!buffer) return res.status(400).send('Файл не загружен');

    const originalText = buffer.toString('utf-8');
    const blocks = parseVtt(originalText);
    
    let newBlocks = [];
    let translatedText = '';
    
    if (operation === 'tokenize') {
      newBlocks = await Promise.all(
        blocks.map(async (block) => {
          const tokenized = await tokenizeJapanese(block.text);
          return { ...block, text: tokenized };
        })
      );
    } else if (operation === 'translate') {
      
      const chunks = chunkBlocks(blocks, 20);
      for (const chunk of chunks) {
        const inputText = chunk.map(b => `${b.time}\n${b.text}`).join('\n\n');
        console.log('🔄 Исходный текст:\n', inputText);

        const chunkTranslated  = await translateText(inputText, sourceLang, targetLang);
        console.log('✅ Переведено:\n', chunkTranslated);

        translatedText += '\n\n' + chunkTranslated.trim();

        const translatedBlocks = parseTranslatedVttBlocks(translatedText);

        for (let i = 0; i < chunk.length; i++) {
          newBlocks.push({
            time: chunk[i].time,
            text: translatedBlocks[i]?.text ?? '[Перевод отсутствует]',
          });
        }
      }
    } else {
      throw new Error('Неизвестная операция');
    }

    res.setHeader('Content-Disposition', 'attachment; filename="result.vtt"');
    res.setHeader('Content-Type', 'text/vtt');
    
    if (operation === 'tokenize') {
      res.send(buildVtt(newBlocks));
    } else {
      res.send('WEBVTT\n\n' + translatedText.trim());
    }
  } catch (err) {
    console.error('❌ Ошибка при обработке:', err);
    res.status(500).send('Ошибка при обработке субтитров');
  }
});

export default router;

