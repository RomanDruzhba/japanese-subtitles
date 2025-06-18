import { css } from 'lit';

const styles = css`
  :host {
    position: absolute;
    display: grid;
    top: 8px;
    right: 8px;
    color: white;
    z-index: 8;
  }

  #subtitles {
    justify-self: end;
    width: 40px;
    height: 40px;
    padding: 8px;
    border-radius: 8px;
    transition: background 300ms ease;
  }

  #subtitles:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: white;
  }

  button {
    box-sizing: border-box;
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    margin: 0;
  }

  #dropdown {
    box-sizing: border-box;
    margin: 4px 0 0;
    padding: 12px 6px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.4);
    cursor: default;
    max-width: 200px;
    width: max-content;
  }

  #dropdown ul {
    box-sizing: border-box;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #dropdown li {
    box-sizing: border-box;
    padding: 8px 16px;
    border-radius: 6px;
    text-align: left;
  }

  #dropdown li:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    :host {
      top: 4px;
      right: 4px;
    }

    #subtitles {
      width: 36px;
      height: 36px;
      padding: 6px;
    }

    #dropdown {
      padding: 10px 4px;
      font-size: 0.9em;
    }

    #dropdown li {
      padding: 6px 12px;
    }
  }

  @media (max-width: 480px) {
    #dropdown {
      max-width: 160px;
      font-size: 0.85em;
    }

    #subtitles {
      width: 32px;
      height: 32px;
      padding: 4px;
    }
  }
`;

export default styles;
