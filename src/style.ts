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

  #container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  #controls {
    position: absolute;
    bottom: 8px; /* чуть выше низа, чтобы субтитры были видны */
    left: 16px;
    right: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.35);
    padding: 6px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease;
    user-select: none;
  }

  #controls.hidden {
    opacity: 0;
    pointer-events: none;
  }

  #controls button,
  #controls select,
  #controls input[type="range"] {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 16px;
    min-width: 40px;
    text-align: center;
  }

  #controls input[type="range"] {
    flex: 1 1 auto;
    min-width: 80px;
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
    z-index: 11;
  }

  #overlay.visible {
    opacity: 1;
  }

  #controls span {
    color: white;
    white-space: nowrap;
  }

  /* Скрываем на мобильных элемента управления скоростью и звуком */
  @media (max-width: 768px) {
    #controls {
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 8px 12px;
      gap: 6px;
    }

    #controls button,
    #controls input[type="range"] {
      font-size: 14px;
      padding: 6px 8px;
      min-width: unset;
    }

    #controls input[type="range"] {
      flex: 1 1 auto;
    }

    #controls span {
      display: none; /* можно скрыть время на мобилках */
    }

    /* Скрываем регуляторы скорости и громкости */
    .speed-control,
    .volume-control {
      display: none;
    }
  }

  @media (max-width: 400px) {
    #controls {
      bottom: 6px;
      left: 8px;
      right: 8px;
      padding: 6px 8px;
      gap: 4px;
    }

    #controls button {
      font-size: 12px;
      padding: 4px 6px;
    }

    #overlay {
      font-size: 18px;
      padding: 8px 16px;
      top: 15%;
    }
  }
`;

export default style;
