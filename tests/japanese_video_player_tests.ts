import {expect} from 'chai';
import {removeChildren} from './test_utils';

import {JapaneseVideoPlayer} from 'japanese_video_player';

describe('Japanese Video Player', () => {
  before(async () => {
    const div = document.createElement('div');
    div.innerHTML = '<japanese-video-player></japanese-video-player>';
    document.body.appendChild(div);
  });

  after(() => {
    removeChildren(document.body);
  });

  it('should be present on the page', () => {
    const player = document.querySelector(JapaneseVideoPlayer.is);
    expect(player).to.be.not.null;
  });

  it('should have video inside', () => {
    const player = document.querySelector(JapaneseVideoPlayer.is)!;
    const video = player.shadowRoot?.querySelector('video');
    expect(video).to.be.not.null;
  });

  it('should have a display: block', async () => {
    const player = document.querySelector(JapaneseVideoPlayer.is)!;

    const styles = window.getComputedStyle(player);
    expect(styles.display).to.equal('block');
  });
});
