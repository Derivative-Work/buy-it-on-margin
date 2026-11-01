import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import times from '../timing/shot_times.json';
import {CARDS} from './config';
import {Card} from './film/devices';
import {FilmLayer} from './film/FilmLayer';
import {Fonts} from './Fonts';
import {Main, MAIN_FRAMES} from './Main';

/**
 * The released video: an opening intertitle (cards.json OPEN: satire, made with AI, not investment advice) over
 * crackle, then the whole Main edit unchanged. The card sits in the brief's "before the leader" slot.
 */
export const INTRO_FRAMES = (times as any).intro.frames as number;
export const RELEASE_FRAMES = INTRO_FRAMES + MAIN_FRAMES;

export const Release: React.FC<{draft?: boolean}> = ({draft}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Fonts />
    <Sequence durationInFrames={INTRO_FRAMES}>
      <FilmLayer><Card text={CARDS.OPEN.text} /></FilmLayer>
      <Audio src={staticFile('audio/intro_crackle.wav')} />
    </Sequence>
    <Sequence from={INTRO_FRAMES}>
      <Main draft={draft} />
    </Sequence>
  </AbsoluteFill>
);
