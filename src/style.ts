import {css} from 'lit';

const style = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }

    video {
      width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
    }

    #controls {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      z-index: 8;
      background: rgba(0, 0, 0, 0.4);
      padding: 8px;
      border-radius: 8px;
      transition: opacity 0.3s ease;
    }

    #controls.hidden {
      opacity: 0;
      pointer-events: none;
    }

    #controls button,
    #controls select {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 16px;
      min-width: 40px;
      text-align: center;
    }

    #overlay {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.75);
      color: white;
      font-size: 24px;
      padding: 12px 24px;
      border-radius: 12px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 8;
    }

    #overlay.visible {
      opacity: 1;
    }

    #controls span {
      color: white;
    }
`;

export default style;
