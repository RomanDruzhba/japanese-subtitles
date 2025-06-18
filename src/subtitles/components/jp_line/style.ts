import { css } from 'lit';

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
    z-index: 8;

    font-size: 16px;
    line-height: 1.3;
    color: white;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  :host([active]) {
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }

  :host([hidden="true"]) {
    display: none;
  }

  

  /* Адаптивность для маленьких экранов */
  @media (max-width: 768px) {
    :host {
      font-size: 14px;
      padding: 3px 6px;
      min-height: 20px;
    }
    jp-token {
      padding: 0 1px;
      white-space: normal; /* разрешаем переносы токенов */
      font-size: 14px;
    }
    span {
      width: 3px;
    }
  }

  @media (max-width: 400px) {
    :host {
      font-size: 12px;
      padding: 2px 4px;
      min-height: 18px;
    }
    jp-token {
      font-size: 12px;
      padding: 0 1px;
    }
    span {
      width: 2px;
    }
  }
`;

export default styles;
