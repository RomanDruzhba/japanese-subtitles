import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

router.get('/videos', (req, res) => {
  const videoList = [];
  fs.readdirSync(BASE_DIR, { withFileTypes: true }).forEach((animeDir) => {
    if (!animeDir.isDirectory()) return;

    const animeTitle = animeDir.name;
    const animePath = path.join(BASE_DIR, animeTitle);

    fs.readdirSync(animePath, { withFileTypes: true }).forEach((file) => {
      if (file.isFile() && /\.(webm|mp4)$/i.test(file.name)) {
        const episodeTitle = path.basename(file.name, path.extname(file.name));
        const subsEpisodeDir = path.join(animePath, 'subs', episodeTitle);
        let subtitles = [];

        if (fs.existsSync(subsEpisodeDir)) {
          subtitles = fs.readdirSync(subsEpisodeDir)
            .filter(sub => /\.vtt$/i.test(sub))
            .map(sub => {
              const match = sub.match(/_([a-z]{2})\d*\.vtt$/i);
              return {
                lang: match ? match[1] : 'unknown',
                url: `/mock/${animeTitle}/subs/${episodeTitle}/${sub}`,
              };
            });
        }

        videoList.push({
          id: episodeTitle,
          animeTitle,
          episodeTitle,
          videoUrl: `/mock/${animeTitle}/${file.name}`,
          subtitles,
        });
      }
    });
  });

  res.json(videoList);
});

export default router;