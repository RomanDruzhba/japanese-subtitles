import {css} from 'lit';

const styles = css`
  :host {
    pointer-events: none;
    display: block;
    width: 100%;
    min-height: 24px;
    border-radius: 8px;
    margin-bottom: 4px;
    padding: 4px 8px;
    letter-spacing: 1px;
    transition: all 150ms ease-in-out;
  }

  :host([active]) {
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }

  :host([hidden="true"]) {
    display: none;
  }
`;

export default styles;
