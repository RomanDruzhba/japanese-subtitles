// import styles from 'subtitles/components/jp_line/style';
// import {html, LitElement} from 'lit';
// import {property} from 'lit/decorators.js';
// import 'subtitles/components/jp_token/jp_token';


// export class JpLine extends LitElement {
//   public static is: string = 'jp-line';
//   public static styles = styles;

//   @property({ type: String })
//     lang = '';

//   @property({ type: Object })
//     textTrack!: TextTrack;

//   @property({ type: Array })
//     tokens: string[] = [];

//   @property({ type: Boolean, reflect: true })
//     active = false;

//   @property({ type: Function })
//     handleTokenClick?: (token: string) => void;

//   constructor() {
//     super();
//     this.handleCueChange = this.handleCueChange.bind(this);
//     this.handleCueEnter = this.handleCueEnter.bind(this);
//     this.handleCueExit = this.handleCueExit.bind(this);
//   }

//   public render() {
//     return html`
//       ${this.tokens.map((token, index) => html`
//       <jp-token
//         token="${token}"
//         .handleTokenClick="${this.handleTokenClick}"
//       ></jp-token>
//       ${index === this.tokens.length - 1 ?
//     '' :
//     html`<span> </span>`}
//     `)}
//     `;
//   }

//   public connectedCallback() {
//     super.connectedCallback();

//     this.textTrack.addEventListener('cuechange', this.handleCueChange);
//   }

//   disconnectedCallback() {
//     super.disconnectedCallback();

//     this.textTrack.removeEventListener('cuechange', this.handleCueChange);
//   }

//   private handleCueChange(event: Event) {
//     const textTrack = event.target as TextTrack;
//     const vttCue = textTrack.activeCues?.[0] as VTTCue;

//     if (!vttCue) return;

//     this.handleCueEnter(vttCue);

//     const exitHandler = () => this.handleCueExit(vttCue);
//     vttCue.addEventListener('exit', exitHandler);
//     // @ts-expect-error Pass link to exitHandler through vttCue.
//     vttCue.exitHandler = exitHandler;
//   }

//   private handleCueEnter(vttCue: VTTCue) {
//     this.updateLine(vttCue.text);
//   }

//   private handleCueExit(vttCue: VTTCue) {
//     // @ts-expect-error Pass link to exitHandler through vttCue.
//     if (vttCue.exitHandler) {
//       // @ts-expect-error Pass link to exitHandler through vttCue.
//       vttCue.removeEventListener('exit', vttCue.exitHandler);
//       // @ts-expect-error Pass link to exitHandler through vttCue.
//       vttCue.exitHandler = null;
//     }

//     this.clearLine();
//   }

//   private updateLine(line: string) {
//     this.clearLine();
//     this.tokens = this.parseTokens(line);
//     this.active = true;
//   }

//   private clearLine() {
//     this.active = false;
//     this.tokens = [];
//   }

//   private parseTokens(line: string): string[] {
//     return line.split(' ');
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     'jp-line': JpLine;
//   }
// }

// customElements.define(JpLine.is, JpLine);

import styles from 'subtitles/components/jp_line/style';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import 'subtitles/components/jp_token/jp_token';

export class JpLine extends LitElement {
  public static is: string = 'jp-line';
  public static styles = styles;

  @property({ type: String })
  lang = '';

  @property({ type: Object })
  textTrack!: TextTrack;

  @property({ type: Array })
  tokens: string[] = [];

  @property({ type: Boolean, reflect: true })
  active = false;

  @property({ type: Function })
  handleTokenClick?: (token: string) => void;

  @property({ type: Function })
  handleJapaneseClick?: (token: string) => void;

  constructor() {
    super();
    this.handleCueChange = this.handleCueChange.bind(this);
    this.handleCueEnter = this.handleCueEnter.bind(this);
    this.handleCueExit = this.handleCueExit.bind(this);
  }

  public render() {
    return html`
      ${this.tokens.map((token, index) => html`
        <jp-token
          token="${token}"
          lang="${this.lang}"
          .handleTokenClick="${this.handleTokenClick}"
          .handleJapaneseClick="${this.handleJapaneseClick}"
        ></jp-token>
        ${index === this.tokens.length - 1 ? '' : html`<span> </span>`}
      `)}
    `;
  }

  public connectedCallback() {
    super.connectedCallback();
    this.textTrack.addEventListener('cuechange', this.handleCueChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.textTrack.removeEventListener('cuechange', this.handleCueChange);
  }

  private handleCueChange(event: Event) {
    const textTrack = event.target as TextTrack;
    const vttCue = textTrack.activeCues?.[0] as VTTCue;
    if (!vttCue) return;

    this.handleCueEnter(vttCue);

    const exitHandler = () => this.handleCueExit(vttCue);
    // @ts-expect-error
    vttCue.exitHandler = exitHandler;
    vttCue.addEventListener('exit', exitHandler);
  }

  private handleCueEnter(vttCue: VTTCue) {
    this.updateLine(vttCue.text);
  }

  private handleCueExit(vttCue: VTTCue) {
    // @ts-expect-error
    if (vttCue.exitHandler) {
      // @ts-expect-error
      vttCue.removeEventListener('exit', vttCue.exitHandler);
      // @ts-expect-error
      vttCue.exitHandler = null;
    }
    this.clearLine();
  }

  private updateLine(line: string) {
    this.clearLine();
    this.tokens = this.parseTokens(line);
    this.active = true;
  }

  private clearLine() {
    this.active = false;
    this.tokens = [];
  }

  private parseTokens(line: string): string[] {
    if (this.lang === 'jpn' || this.lang === 'jp') {
      // Для японского — по символам
      return Array.from(line.trim());
    } else {
      // Для остальных языков — по словам
      return line.trim().split(/\s+/);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jp-line': JpLine;
  }
}

customElements.define(JpLine.is, JpLine);
