import {css} from 'lit';

const style = css`
    :host {
      display: block;
      position: relative;
      background-color: black;
      width: 100%;
      height: 100%;
    }

    video {
      width: 100%;
      height: auto;
      display: block;
    }

    #container {
      position: relative;
      width: 100%;
      height: 100%;
    }
`;

export default style;
