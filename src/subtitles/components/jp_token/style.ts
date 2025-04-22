import {css} from 'lit';

const style = css`
:host {
  color: #ddd;
}

:host(:hover) {
  color: #fff;
}

button {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: default;
  outline: inherit;
}
`;

export default style;
