import {Subtitle} from 'types';

export const baseUrl = process.env.NODE_ENV === 'production' ?
  '/japanese-player' :
  '';

export const subtitles: Subtitle[] = [
  {
    src: `${baseUrl}/src/mock/video_subs_ru.vtt`,
    srclang: 'ru',
    label: 'Русский',
  },
  {
    src: `${baseUrl}/src/mock/video_subs_jp.vtt`,
    srclang: 'jpn',
    label: '日本語',
  }
];
