import React from 'react';
import {Composition} from 'remotion';
import {FILM} from './config';
import {M2_FRAMES, M2Test} from './M2Test';
import {Main, MAIN_FRAMES} from './Main';

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={MAIN_FRAMES} fps={FILM.frame.fps}
      width={FILM.frame.width} height={FILM.frame.height} />
    <Composition id="M2Test" component={M2Test} durationInFrames={M2_FRAMES} fps={FILM.frame.fps}
      width={FILM.frame.width} height={FILM.frame.height} />
  </>
);
