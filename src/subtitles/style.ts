import {css} from 'lit';

const styles = css`
  :host {
    position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    max-width: 80%;
    margin: 0 auto;
    text-align: center;
    cursor: default;
    box-sizing: border-box;
    font-size: 20px;
    line-height: 1.6;
    font-weight: 500;
    color: white;
    text-shadow: 0 0 4px black;
    z-index: 999;
  }
`;

export default styles;
