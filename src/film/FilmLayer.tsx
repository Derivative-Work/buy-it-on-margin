import React from 'react';
import {AbsoluteFill, Freeze, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FILM, PIC_H, PIC_W, SEED} from '../config';
import {heldFrame, pictureIndex} from './cadence';
import {hash, smooth} from './rand';

/**
 * The one wrapper every shot passes through (brief, "The film layer"). Stacking order:
 * cadence (18 fps holds) -> tone -> softness -> gate weave -> flicker -> grain -> dust and scratches -> vignette,
 * inside a 4:3 picture pillarboxed in the 16:9 frame. All randomness is seeded per picture frame.
 */

const S_TONE = 'film-tone';
// stream ids for hash()
const WEAVE_X = 1, WEAVE_Y = 2, FLICK = 3, GRAIN = 4, GRAIN_X = 5, GRAIN_Y = 6, DUST = 10, SCRATCH = 20;

const ToneFilter: React.FC = () => {
  const curve = FILM.tone.contrast_curve.join(' ');
  const t = FILM.tone.warm_tint;
  // Desaturate fully, apply the contrast curve (crushed blacks, soft highlights), then an optional faint warm tint.
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id={S_TONE} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues={curve} />
          <feFuncG type="table" tableValues={curve} />
          <feFuncB type="table" tableValues={curve} />
        </feComponentTransfer>
        <feColorMatrix
          type="matrix"
          values={`${1 + t} 0 0 0 0  0 1 0 0 0  0 0 ${1 - t} 0 0  0 0 0 1 0`}
        />
      </filter>
    </svg>
  );
};

const inClean = (t: number) => FILM.clean_ranges_s.some(([a, b]: number[]) => t >= a && t <= b);

const Dust: React.FC<{p: number; t: number}> = ({p, t}) => {
  if (inClean(t)) return null;
  const pfps = FILM.frame.picture_fps;
  const items: React.ReactNode[] = [];
  // Specks: Poisson-ish count per picture frame, each lives one picture frame (as real dust does).
  const perFrame = FILM.dust.specks_per_s / pfps;
  const n = Math.floor(perFrame * 3 * hash(SEED, DUST, p * 7) + (hash(SEED, DUST + 1, p) < perFrame % 1 ? 1 : 0));
  const [smin, smax] = FILM.dust.size_px;
  for (let i = 0; i < n; i++) {
    const x = hash(SEED, DUST + 2, p * 31 + i) * PIC_W;
    const y = hash(SEED, DUST + 3, p * 31 + i) * PIC_H;
    const r = smin + (smax - smin) * hash(SEED, DUST + 4, p * 31 + i) ** 2;
    const light = hash(SEED, DUST + 5, p * 31 + i) < 0.3;
    items.push(
      <ellipse key={`d${i}`} cx={x} cy={y} rx={r} ry={r * (0.6 + 0.8 * hash(SEED, DUST + 6, p * 31 + i))}
        fill={light ? '#fff' : '#000'} opacity={0.55 + 0.4 * hash(SEED, DUST + 7, p * 31 + i)} />,
    );
  }
  // An occasional hair: a thin curved stroke for one picture frame.
  if (hash(SEED, DUST + 8, p) < FILM.dust.hair_chance_per_s / pfps) {
    const x = hash(SEED, DUST + 9, p) * PIC_W, y = hash(SEED, DUST + 11, p) * PIC_H;
    const dx = 30 + 60 * hash(SEED, DUST + 12, p), dy = 20 + 50 * hash(SEED, DUST + 13, p);
    items.push(<path key="hair" d={`M${x},${y} q${dx},${-dy} ${dx * 1.6},${dy * 0.4}`} stroke="#000"
      strokeWidth={1.2} fill="none" opacity={0.7} />);
  }
  // Vertical scratch: starts at random picture frames, persists a few frames, drifts slightly.
  const [fmin, fmax] = FILM.scratch.picture_frames;
  for (let back = 0; back < fmax; back++) {
    const s = p - back;
    if (s < 0 || hash(SEED, SCRATCH, s) >= FILM.scratch.chance_per_s / pfps) continue;
    const life = fmin + Math.floor((fmax - fmin + 1) * hash(SEED, SCRATCH + 1, s));
    if (back >= life) continue;
    const x0 = hash(SEED, SCRATCH + 2, s) * PIC_W;
    const x = x0 + back * (hash(SEED, SCRATCH + 3, s) - 0.5) * 3;
    const light = hash(SEED, SCRATCH + 4, s) < 0.7;
    items.push(<rect key={`s${s}`} x={x} y={0} width={1 + hash(SEED, SCRATCH + 5, s) * 1.5} height={PIC_H}
      fill={light ? '#fff' : '#000'} opacity={FILM.scratch.opacity * (0.6 + 0.4 * hash(SEED, SCRATCH + 6, p))} />);
  }
  return (
    <svg width={PIC_W} height={PIC_H} style={{position: 'absolute', inset: 0}}>
      {items}
    </svg>
  );
};

/** frameOffset: the master frame this layer's frame 0 stands for (the Shorts), so cadence, grain and dust match the main video. */
export const FilmLayer: React.FC<{children: React.ReactNode; bypass?: boolean; frameOffset?: number}> = ({children, bypass, frameOffset = 0}) => {
  const frame = useCurrentFrame() + frameOffset;
  const {fps} = useVideoConfig();
  const p = pictureIndex(frame);
  const t = frame / fps;
  const wx = smooth(SEED, WEAVE_X, p, FILM.weave.smooth_frames) * FILM.weave.x_px;
  const wy = smooth(SEED, WEAVE_Y, p, FILM.weave.smooth_frames) * FILM.weave.y_px;
  const fl = FILM.flicker.min + (FILM.flicker.max - FILM.flicker.min) * hash(SEED, FLICK, p);
  const g = Math.floor(hash(SEED, GRAIN, p) * FILM.grain.plates);
  const gx = (hash(SEED, GRAIN_X, p) - 0.5) * 200, gy = (hash(SEED, GRAIN_Y, p) - 0.5) * 200;
  const v = FILM.vignette;
  const content = <Freeze frame={heldFrame(frame) - frameOffset}>{children}</Freeze>;
  if (bypass) return <AbsoluteFill style={{background: '#000'}}>{content}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <ToneFilter />
      <div style={{position: 'relative', width: PIC_W, height: PIC_H, overflow: 'hidden', background: '#000'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${wx}px, ${wy}px)`,
          filter: `url(#${S_TONE}) blur(${FILM.softness_px}px) brightness(${fl})`}}>
          {content}
        </div>
        <div style={{position: 'absolute', inset: -120, transform: `translate(${gx}px, ${gy}px)`,
          mixBlendMode: 'overlay', opacity: FILM.grain.opacity}}>
          <Img src={staticFile(`grain/grain_${String(g).padStart(2, '0')}.png`)}
            style={{width: PIC_W + 240, height: PIC_H + 240, imageRendering: 'auto'}} />
        </div>
        <Dust p={p} t={t} />
        <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${v.inner * 100}%, rgba(0,0,0,${v.strength}) 100%)`}} />
      </div>
    </AbsoluteFill>
  );
};
