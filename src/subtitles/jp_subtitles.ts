// import {property} from 'lit/decorators.js';
// import styles from 'subtitles/style';
// import {LitElement, html} from 'lit';
// import {TextTrackExtendedList} from 'types';

// import 'subtitles/components/jp_line/jp_line';

// export class JpSubtitles extends LitElement {
//   public static is: string = 'jp-subtitles';
//   public static styles = styles;

//   @property({ type: Object })
//     textTracks?: TextTrackExtendedList;

//   @property({ type: Function })
//     handleTokenClick?: (token: string) => void;

//   public render() {
//     if (!this.textTracks) {
//       return html``;
//     }

//     return html`
//       ${Array.from(this.textTracks).map((textTrack) => (
//     html`
//       <jp-line
//         hidden="${textTrack.isActive === 'false'}"
//         lang="${textTrack.language}"
//         .textTrack="${textTrack}"
//         .handleTokenClick="${this.handleTokenClick}"
//       ></jp-line>
//     `
//   ))}
//     `;
//   }

//   public forceUpdate() {
//     this.requestUpdate();
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     'jp-subtitles': JpSubtitles;
//   }
// }

// customElements.define(JpSubtitles.is, JpSubtitles);

import {property} from 'lit/decorators.js';
import styles from 'subtitles/style';
import {LitElement, html} from 'lit';
import {TextTrackExtendedList} from 'types';

import 'subtitles/components/jp_line/jp_line';

export class JpSubtitles extends LitElement {
  public static is: string = 'jp-subtitles';
  public static styles = styles;

  @property({ type: Object })
  textTracks?: TextTrackExtendedList;

  @property({ type: Function })
  handleTokenClick?: (token: string) => void;

  public render() {
    if (!this.textTracks) {
      return html``;
    }

    return html`
      ${Array.from(this.textTracks)
        .filter((track) => track.isActive !== 'false')
        .map((track) => html`
          <jp-line
            lang="${track.language}"
            .textTrack="${track}"
            .handleTokenClick="${this.handleTokenClick}"
          ></jp-line>
        `)}
    `;
  }

  public forceUpdate() {
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jp-subtitles': JpSubtitles;
  }
}

customElements.define(JpSubtitles.is, JpSubtitles);
