import { LitElement, html, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import style from './style';
import { JpPanel } from 'subtitles/components/jp_panel/jp_panel';
import { JpSubtitles } from 'subtitles/jp_subtitles';
import { Subtitle, TextTrackExtended, DictionaryEntry } from 'types';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

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
  @property({ type: Boolean }) isFullscreen = false;
  @property({ type: Boolean }) isPlaying = false;

  @property({ type: Number }) duration = 0;
  @property({ type: Number }) currentTime = 0;
  @property({ type: Number }) volume = 1;
  @property({ type: Number }) playbackRate = 1;
  @property({ type: Boolean }) showControls = true;
  private hideControlsTimeout?: number;

  public async firstUpdated(changedProperties: PropertyValues) {
    if (changedProperties.has('subtitles') && this.videoElement) {
      this.loadSubtitles();
    }
    this.videoElement.addEventListener('play', () => {
      this.isPlaying = true;
    });
    this.videoElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.currentTime = this.videoElement.currentTime;
    });
    this.videoElement.addEventListener('loadedmetadata', () => {
      this.duration = this.videoElement.duration;
    });

    this.videoElement.addEventListener('mousemove', this.resetControlsTimeout);
    this.videoElement.addEventListener('mouseleave', () => this.showControls = false);
    this.containerElement.addEventListener('mousemove', this.resetControlsTimeout);

    this.resetControlsTimeout();
  }

  resetControlsTimeout = () => {
    this.showControls = true;
    clearTimeout(this.hideControlsTimeout);
    this.hideControlsTimeout = window.setTimeout(() => {
      this.showControls = false;
    }, 2000);
  };

  seek(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const newTime = parseFloat(input.value);
    this.videoElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  changeVolume(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    this.videoElement.volume = this.volume;
    this.showOverlay(`🔊 ${Math.round(this.volume * 100)}%`);
  }

  changeSpeed(delta: number) {
    const newRate = Math.min(3, Math.max(0.25, this.playbackRate + delta));
    this.playbackRate = newRate;
    this.videoElement.playbackRate = newRate;
    this.showOverlay(`${this.playbackRate.toFixed(2)}x`);
  }

  seekRelative(seconds: number) {
    this.videoElement.currentTime += seconds;
  }


  togglePlay() {
    if (this.videoElement.paused) {
      this.videoElement.play();
    } else {
      this.videoElement.pause();
    }
  }

  onFullscreenChange = () => {
    this.isFullscreen = document.fullscreenElement !== null;
  };

  toggleFullscreen() {
    const container = this.containerElement;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    }
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    this.videoElement.volume = this.volume;
  }

  handleKeydown = (event: KeyboardEvent) => {
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (event.target as HTMLElement)?.isContentEditable) {
      return; // не срабатывает при вводе текста
    }

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlay();
        this.showOverlay(this.isPlaying ? '⏸ Пауза' : '▶️ Воспроизведение');
        break;
      case 'ArrowLeft':
        this.seekRelative(-5);
        this.showOverlay(`⏪ −5с`);
        break;
      case 'ArrowRight':
        this.seekRelative(5);
        this.showOverlay(`⏩ +5с`);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setVolume(this.volume + 0.1);
        this.showOverlay(`🔊 ${Math.round(this.volume * 100)}%`);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.setVolume(this.volume - 0.1);
        this.showOverlay(`🔉 ${Math.round(this.volume * 100)}%`);
        break;
      case 'f':
      case 'F':
      case 'А':
      case 'а':
        this.toggleFullscreen();

        break;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    window.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    window.removeEventListener('keydown', this.handleKeydown);
    super.disconnectedCallback();
  }

  private overlayText = '';
  private overlayTimeout: number | undefined;

  private showOverlay(text: string, duration = 1000) {
    this.overlayText = text;
    this.requestUpdate();

    if (this.overlayTimeout) clearTimeout(this.overlayTimeout);
    this.overlayTimeout = window.setTimeout(() => {
      this.overlayText = '';
      this.requestUpdate();
    }, duration);
  }

  private dictionary: Record<string, DictionaryEntry[]> = {};

  public render() {
    return html`
      <div id="container">
        <video
          id="video"
          src="${this.src}"
          preload="auto"
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
        <div id="controls" class="${this.showControls ? '' : 'hidden'}">
         
          <button id="play-pause" @click="${this.togglePlay}">
            ${this.isPlaying ? '❚❚' : '►'}
          </button>
          <button @click=${() => this.seekRelative(-10)}>« 10с</button>
          <button @click=${() => this.seekRelative(10)}>10с »</button>
          <input
            type="range"
            min="0"
            max="${this.duration}"
            step="0.1"
            .value="${String(this.currentTime)}"
            @input=${this.seek}
            style="flex: 1"
          />
          <span>${formatTime(this.currentTime)} / ${formatTime(this.duration)}</span>
          <button @click=${() => this.changeSpeed(-0.25)}>-скор</button>
          <span>${this.playbackRate.toFixed(2)}x</span>
          <button @click=${() => this.changeSpeed(0.25)}>+скор</button>
          <input type="range" min="0" max="1" step="0.01" .value="${String(this.volume)}" @input=${this.changeVolume} />
          <button id="fullscreen" @click="${this.toggleFullscreen}">
            ${this.isFullscreen ? '⛶ ↩' : '⛶'}
          </button>
          
        </div>
        <div id="overlay" class="${this.overlayText ? 'visible' : ''}">${this.overlayText}</div>

        

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
