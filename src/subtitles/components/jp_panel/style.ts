import {css} from 'lit';

const styles = css`
  :host {
    position: absolute;
    display: grid;
    top: 8px;
    right: 8px;
    color: white;
  }

  #dropdown {
    box-sizing: border-box;
    margin: 2px 0 0;
    padding: 16px 4px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    cursor: default;
  }

  #dropdown ul {
    box-sizing: border-box;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #dropdown li {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 24px;

    border-radius: 8px;
  }

  #dropdown li:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    fill: white;
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

  button {
    box-sizing: border-box;
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: default;
    outline: inherit;
    margin: 0;
  }
`;

export default styles;
