import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, staticFile} from 'remotion';
import {CARDS} from './config';
import {FilmLayer} from './film/FilmLayer';
import {Burn, Card, Clip, Iris, Leader, Still} from './film/devices';
import {Fonts} from './Fonts';

/** M2 gate: every film effect and device on placeholder media (brief: three stills and one clip). */
export const M2_FRAMES = 600;
const S = {
  leader: [0, 56], irisOpen: [56, 128], card1: [128, 188], pan: [188, 260], clip: [260, 332],
  freezeBurn: [332, 380], date: [380, 440], fact: [440, 540], irisClose: [540, 600],
} as const;
const seq = (k: keyof typeof S) => ({from: S[k][0], durationInFrames: S[k][1] - S[k][0]});

export const M2Test: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Fonts />
    <Audio src={staticFile('audio/master.wav')} />
    <FilmLayer>
      <Sequence {...seq('leader')}><Leader /></Sequence>
      <Sequence {...seq('irisOpen')}>
        <Iris mode="open" durationFrames={30}>
          <Still src="media/test/still_a.png" from={{scale: 1.0, x: 0, y: 0}} to={{scale: 1.08, x: 0.02, y: -0.01}} />
        </Iris>
      </Sequence>
      <Sequence {...seq('card1')}><Card text={CARDS.N03.text} /></Sequence>
      <Sequence {...seq('pan')}>
        <Still src="media/test/still_b.png" from={{scale: 1.15, x: -0.06, y: 0}} to={{scale: 1.15, x: 0.06, y: 0}} />
      </Sequence>
      <Sequence {...seq('clip')}><Clip src="media/test/clip_placeholder.mp4" /></Sequence>
      <Sequence {...seq('freezeBurn')}>
        <Freeze frame={71}><Clip src="media/test/clip_placeholder.mp4" /></Freeze>
        <Burn startFrame={18} durationFrames={30} />
      </Sequence>
      <Sequence {...seq('date')}><Card text={CARDS.N31a.text} /></Sequence>
      <Sequence {...seq('fact')}><Card text={CARDS.N31c.text} /></Sequence>
      <Sequence {...seq('irisClose')}>
        <Iris mode="close" durationFrames={40} startFrame={10}>
          <Still src="media/test/still_a.png" from={{scale: 1.1, x: 0, y: 0}} to={{scale: 1.04, x: 0, y: 0}} />
        </Iris>
      </Sequence>
    </FilmLayer>
  </AbsoluteFill>
);
