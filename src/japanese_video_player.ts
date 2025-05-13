// import { LitElement, html, PropertyValues } from 'lit';
// import { property, query } from 'lit/decorators.js';
// import style from './style';
// import { JpPanel } from 'subtitles/components/jp_panel/jp_panel';
// import { JpSubtitles } from 'subtitles/jp_subtitles';
// import { Subtitle, TextTrackExtended, TextTrackExtendedList, DictionaryEntry } from 'types';
// import './DictionaryModal'; // убедись, что путь правильный

// export class JapaneseVideoPlayer extends LitElement {
//   public static is: string = 'japanese-video-player';
//   public static styles = style;

//   @property({ type: String }) src = '';
//   @property({ type: Array }) subtitles: Array<Subtitle> = [];
//   @property({ type: Function }) handleTokenClick?: (token: string) => void;

//   @query('#video') videoElement!: HTMLVideoElement;
//   @query(JpSubtitles.is) subtitlesElement!: JpSubtitles;
//   @query(JpPanel.is) panelElement!: JpPanel;

//   private dictionary: Record<string, DictionaryEntry[]> = {};
//   private modalWord: string | null = null;
//   private modalEntries: DictionaryEntry[] = [];

//   public render() {
//     return html`
//       <video
//         id="video"
//         src="${this.src}"
//         preload="auto"
//         controls
//         controlsList="nodownload"
//       >
//         ${this.subtitles.map(
//           (subtitle: Subtitle) => html`
//             <track
//               id="${subtitle.srclang}"
//               kind="subtitles"
//               src="${subtitle.src}"
//               srclang="${subtitle.srclang}"
//               label="${subtitle.label}"
//               ${subtitle.default ? 'default' : ''}
//             >
//           `
//         )}
//         Your browser does not support the video tag.
//       </video>

//       <jp-subtitles .handleTokenClick="${this.handleTokenClickInternal}"></jp-subtitles>
//       <jp-panel .handleTextTrackClick="${this.toggleSubtitle}"></jp-panel>

//       ${this.modalWord && this.modalEntries.length > 0 ? html`
//         <dictionary-modal
//           .word="${this.modalWord}"
//           .entries="${this.modalEntries}"
//           .onClose="${this.closeDictionaryModal}"
//         ></dictionary-modal>
//       ` : ''}
//     `;
//   }

//   public updated(changedProperties: PropertyValues) {
//     if (changedProperties.has('subtitles') && this.videoElement) {
//       const tracks = Array.from(this.videoElement.textTracks) as TextTrack[];
//       const textTracks: TextTrackExtended[] = tracks.map((track) => {
//         const extended = track as TextTrackExtended;
//         extended.isActive = 'true';
//         return extended;
//       });
  
//       this.subtitlesElement.textTracks = textTracks;
//       this.panelElement.textTracks = textTracks;
//     }
//   }

//   public async firstUpdated(changedProperties: PropertyValues) {
//     if (changedProperties.has('subtitles') && this.videoElement) {
//       this.loadSubtitles();
//     }

//     // Загружаем словарь
//     try {
//       const res = await fetch('../public/mock/warodai_parsed.json');
//       this.dictionary = await res.json();
//     } catch (err) {
//       console.error('❌ Ошибка загрузки словаря:', err);
//     }
//   }

//   private loadSubtitles() {
//     for (const textTrack of this.videoElement.textTracks) {
//       textTrack.mode = 'showing';
//       textTrack.mode = 'hidden';
//     }
//   }

//   private toggleSubtitle = (textTrack: TextTrackExtended): void => {
//     textTrack.isActive = textTrack.isActive === 'true' ? 'false' : 'true';
//     this.subtitlesElement.forceUpdate();
//   };

//   private handleTokenClickInternal = (token: string) => {
//     const entries = this.dictionary[token];
//     if (entries) {
//       this.showDictionaryModal(token, entries);
//     } else {
//       alert(`Вы кликнули на: ${token}`);
//     }
//   };

//   private showDictionaryModal(word: string, entries: DictionaryEntry[]) {
//     this.modalWord = word;
//     this.modalEntries = entries;
//     this.requestUpdate();
//   }

//   private closeDictionaryModal = () => {
//     this.modalWord = null;
//     this.modalEntries = [];
//     this.requestUpdate();
//   };
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     'japanese-video-player': JapaneseVideoPlayer;
//   }
// }

// customElements.define(JapaneseVideoPlayer.is, JapaneseVideoPlayer);

import { LitElement, html, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import style from './style';
import { JpPanel } from 'subtitles/components/jp_panel/jp_panel';
import { JpSubtitles } from 'subtitles/jp_subtitles';
import { Subtitle, TextTrackExtended, DictionaryEntry } from 'types';

export class JapaneseVideoPlayer extends LitElement {
  public static is: string = 'japanese-video-player';
  public static styles = style;

  @property({ type: String }) src = '';
  @property({ type: Array }) subtitles: Array<Subtitle> = [];
  @property({ type: Function }) handleTokenClick?: (token: string) => void;

  @query('#video') videoElement!: HTMLVideoElement;
  @query(JpSubtitles.is) subtitlesElement!: JpSubtitles;
  @query(JpPanel.is) panelElement!: JpPanel;

  @query('#container') containerElement!: HTMLDivElement;

  goFullscreen() {
    const container = this.containerElement;
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if ((container as any).webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen();
    } else if ((container as any).msRequestFullscreen) {
      (container as any).msRequestFullscreen();
    }
  }

  private dictionary: Record<string, DictionaryEntry[]> = {};

  public render() {
    return html`
      <div id="container">
        <video
          id="video"
          src="${this.src}"
          preload="auto"
          controls
          controlsList="nodownload"
        >
          ${this.subtitles.map(
    (subtitle: Subtitle) => html`
              <track
                id="${subtitle.srclang}"
                kind="subtitles"
                src="${subtitle.src}"
                srclang="${subtitle.srclang}"
                label="${subtitle.label}"
                ${subtitle.default ? 'default' : ''}
              >
            `
  )}
          Your browser does not support the video tag.
        </video>

        <jp-subtitles .handleTokenClick="${this.handleTokenClickInternal}"></jp-subtitles>
        <jp-panel .handleTextTrackClick="${this.toggleSubtitle}"></jp-panel>
      </div>
    `;
  }

  public updated(changedProperties: PropertyValues) {
    if (changedProperties.has('subtitles') && this.videoElement) {
      const trackList = this.videoElement.textTracks;
      const tracks: TextTrack[] = Array.from(trackList); // безопасно и типизировано
  
      const textTracks: TextTrackExtended[] = tracks.map((track) => {
        const extended = track as TextTrackExtended;
        extended.isActive = 'true';
        return extended;
      });
  
      this.subtitlesElement.textTracks = textTracks;
      this.panelElement.textTracks = textTracks;
    }
  }

  public async firstUpdated(changedProperties: PropertyValues) {
    if (changedProperties.has('subtitles') && this.videoElement) {
      this.loadSubtitles();
    }
  }

  private loadSubtitles() {
    for (const textTrack of Array.from(this.videoElement.textTracks)) {
      textTrack.mode = 'showing';
      textTrack.mode = 'hidden';
    }
  }

  private toggleSubtitle = (textTrack: TextTrackExtended): void => {
    textTrack.isActive = textTrack.isActive === 'true' ? 'false' : 'true';
    this.subtitlesElement.forceUpdate();
  };

  private handleTokenClickInternal = (token: string) => {
    if (this.handleTokenClick) {
      this.handleTokenClick(token);
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'japanese-video-player': JapaneseVideoPlayer;
  }
}

customElements.define(JapaneseVideoPlayer.is, JapaneseVideoPlayer);
