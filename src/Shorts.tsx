import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import shorts from '../config/shorts.json';
import times from '../timing/shot_times.json';
import {Captions} from './Captions';
import {CARDS, FPS} from './config';
import {Card} from './film/devices';
import {FilmLayer} from './film/FilmLayer';
import {Fonts} from './Fonts';
import {Main} from './Main';

/**
 * The vertical Shorts, 1080x1920, one per entry in config/shorts.json: title above, the film-layered picture (the
 * main edit, scaled 0.75 and cropped to its 4:3 picture) in the middle, captions below. The music and picture start on
 * the first frame; the SH00 disclaimer card covers the picture for the first disclaimer_s.
 */
const S = (times as any).shots;
const CFG = shorts as any;
const PIC_TOP = 560;

/** "N08.start" | "N13.end" | seconds -> a frame on the master timeline. */
const at = (v: string | number): number => {
  if (typeof v === 'number') return Math.round(v * FPS);
  const [id, edge] = v.split('.');
  return S[id][edge === 'end' ? 'end_frame' : 'start_frame'];
};

export const shortSpec = (id: string) => {
  const c = CFG.shorts[id];
  const from = at(c.from), to = at(c.to);
  return {from, to, frames: to - from, // a shot's end frame is the next shot's first: hold on the last frame of the named shot
    hold: c.hold_from !== undefined ? at(c.hold_from) - (String(c.hold_from).endsWith('.end') ? 1 : 0) : undefined,
    disclaimer: Math.round((c.disclaimer_s ?? CFG.disclaimer_s) * FPS)};
};
export const SHORT_IDS = Object.keys(CFG.shorts);

/** The 1920x1080 main frame scaled to 1440x810; its 4:3 picture lands 1080 wide, centred. */
const Picture: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 0, top: PIC_TOP, width: 1080, height: 810, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -180, top: 0, width: 1920, height: 1080, transform: 'scale(0.75)', transformOrigin: '0 0'}}>
      {children}
    </div>
  </div>
);

export const Short: React.FC<{id: string}> = ({id}) => {
  const {from, frames, hold, disclaimer} = shortSpec(id);
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <Fonts />
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', color: '#efebe1'}}>
        <div style={{fontFamily: 'Limelight', fontSize: 96, letterSpacing: '0.03em'}}>{CARDS.SH_TITLE.text}</div>
        <div style={{fontFamily: 'Old Standard TT', fontStyle: 'italic', fontSize: 46, marginTop: 14, color: '#bdb7aa'}}>1929, again</div>
      </div>
      <Picture>
        <Main captions={false} audio={false} holdFrom={hold} offset={from} />
        <Sequence durationInFrames={disclaimer}>
          <FilmLayer><Card text={CARDS.SH00.text} /></FilmLayer>
        </Sequence>
      </Picture>
      <Audio src={staticFile('audio/master_padded.wav')} startFrom={from}
        volume={(f) => interpolate(f, [0, 4, frames - 12, frames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <div style={{position: 'absolute', top: PIC_TOP + 810 + 60, left: 0, right: 0, height: 400}}>
        <Captions offsetS={from / FPS} size={58} width={960} />
      </div>
    </AbsoluteFill>
  );
};
