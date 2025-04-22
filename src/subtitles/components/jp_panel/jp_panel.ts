import {LitElement, html} from 'lit';
import { property } from 'lit/decorators.js';
import {TextTrackExtendedList} from 'types';
import styles from './style';

const renderSubtitlesIcon = () => {
  return html`
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M18.795 4H5.205c-1.115 0-1.519.116-1.926.334a2.272 2.272 0 0 0-.945.945C2.116 5.686 2 6.09 2 7.205v9.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h13.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926v-9.59c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C20.314 4.116 19.91 4 18.795 4ZM4.356 6.049c.155-.03.422-.049.849-.049h13.59c.427 0 .694.019.849.049.06.012.074.017.134.049a.275.275 0 0 1 .125.124c.031.06.036.073.048.134.03.155.049.422.049.849v9.59c0 .427-.019.694-.049.849a.353.353 0 0 1-.049.134.275.275 0 0 1-.124.125.353.353 0 0 1-.134.048c-.155.03-.422.049-.849.049H5.205c-.427 0-.694-.019-.849-.049a.353.353 0 0 1-.134-.049.275.275 0 0 1-.124-.124.353.353 0 0 1-.049-.134c-.03-.155-.049-.422-.049-.849v-9.59c0-.427.019-.694.049-.849a.353.353 0 0 1 .049-.134.275.275 0 0 1 .124-.124.353.353 0 0 1 .134-.049ZM6 15a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm9-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-9-3a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm5-1a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Z"/>
    </svg>
  `;
};

export class JpPanel extends LitElement {
  public static is: string = 'jp-panel';

  public static styles = styles;

  @property({ type: Function })
    handleTextTrackClick?: (textTrack: TextTrack) => void;

  @property({ type: Object })
    textTracks?: TextTrackExtendedList;

  @property({ type: Boolean })
    showDropdown = false;

  public render() {
    return html`
      <button id="subtitles" @click="${this.toggleDropDown}">
        ${renderSubtitlesIcon()}
      </button>
      <div id="dropdown" ?hidden="${!this.showDropdown}">
        <ul>
          ${Array.from(this.textTracks ?? []).map((textTrack) => (
    html`
              <li>
                <button @click="${() => this.onSelectItem(textTrack)}">
                  ${textTrack.label} ${!textTrack.isActive || textTrack.isActive === 'true' ? '  ✔' : ''}
                </button>
              </li>
            `
  ))}
        </ul>
      </div>
    `;
  }

  firstUpdated() {
    this.addEventListener('blur', () => {
      if (this.showDropdown) {
        this.showDropdown = false;
      }
    }, true);
  }

  private onSelectItem(textTrack: TextTrack) {
    this.handleTextTrackClick?.(textTrack);
    this.showDropdown = false;
  }

  private toggleDropDown() {
    this.showDropdown = !this.showDropdown;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jp-panel': JpPanel;
  }
}

customElements.define(JpPanel.is, JpPanel);
