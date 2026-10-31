import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import times from '../timing/shot_times.json';
import {Captions} from './Captions';
import {CARDS, cardHoldS, FPS} from './config';
import {Card} from './film/devices';
import {FilmLayer} from './film/FilmLayer';
import {Fonts} from './Fonts';
import {Main} from './Main';

/**
 * M5: the vertical Short (brief: N08 through N13, verse 1 into the first chorus, intertitle stacked above the
 * 4:3 picture, a "Not investment advice" card first). 1080x1920: title above, the film-layered picture (the main
 * edit, scaled 0.75 and cropped to its 4:3 picture) in the middle, captions below.
 */
const S = (times as any).shots;
export const SH_FROM = S.N08.start_frame as number;
export const SH_TO = S.N13.end_frame as number;
export const SH_INTRO = Math.round(cardHoldS(CARDS.SH00.text) * FPS);
export const SH_FRAMES = SH_INTRO + (SH_TO - SH_FROM);
const PIC_TOP = 560;

/** The 1920x1080 main frame scaled to 1440x810; its 4:3 picture lands 1080 wide, centred. */
const Picture: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 0, top: PIC_TOP, width: 1080, height: 810, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -180, top: 0, width: 1920, height: 1080, transform: 'scale(0.75)', transformOrigin: '0 0'}}>
      {children}
    </div>
  </div>
);

export const Shorts: React.FC = () => {
  const music = SH_TO - SH_FROM;
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <Fonts />
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', color: '#efebe1'}}>
        <div style={{fontFamily: 'Limelight', fontSize: 96, letterSpacing: '0.03em'}}>{CARDS.SH_TITLE.text}</div>
        <div style={{fontFamily: 'Old Standard TT', fontStyle: 'italic', fontSize: 46, marginTop: 14, color: '#bdb7aa'}}>1929, again</div>
      </div>
      <Picture>
        <Sequence durationInFrames={SH_INTRO}>
          <FilmLayer><Card text={CARDS.SH00.text} /></FilmLayer>
        </Sequence>
        <Sequence from={SH_INTRO}>
          <Sequence from={-SH_FROM}>
            <Main captions={false} audio={false} />
          </Sequence>
        </Sequence>
      </Picture>
      <Sequence from={SH_INTRO} durationInFrames={music}>
        <Audio src={staticFile('audio/master_padded.wav')} startFrom={SH_FROM}
          volume={(f) => interpolate(f, [0, 6, music - 12, music], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        <div style={{position: 'absolute', top: PIC_TOP + 810 + 60, left: 0, right: 0, height: 400}}>
          <Captions offsetS={SH_FROM / FPS} size={58} width={960} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
