import React from 'react';
import {Composition} from 'remotion';
import {FILM} from './config';
import {M2_FRAMES, M2Test} from './M2Test';

export const Root: React.FC = () => (
  <>
    <Composition id="M2Test" component={M2Test} durationInFrames={M2_FRAMES} fps={FILM.frame.fps}
      width={FILM.frame.width} height={FILM.frame.height} />
  </>
);
