import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Loop, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FILM, PIC_H, PIC_W, SEED} from '../config';
import {hash} from './rand';

/* ---------- Still: a black-and-white image animated with a slow eased push or pan ---------- */

export type Frame = {scale: number; x: number; y: number}; // x, y: centre offset as a fraction of the picture width/height

/** Brief: never faster than ~5% of frame width per second (except the final chorus: pass allowFast). */
/** aspect: the image's width/height. A wider or taller image than 4:3 keeps its shape (fills the frame's short side),
 * so pans and tilts have room to travel; x, y offsets are fractions of the picture width/height. */
export const Still: React.FC<{src: string; from: Frame; to: Frame; allowFast?: boolean; aspect?: number; children?: React.ReactNode}> =
  ({src, from, to, allowFast, aspect = PIC_W / PIC_H, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const k = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    easing: Easing.inOut(Easing.sin), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const iw = aspect >= PIC_W / PIC_H ? PIC_H * aspect : PIC_W;
  const ih = aspect >= PIC_W / PIC_H ? PIC_H : PIC_W / aspect;
  const s = from.scale + (to.scale - from.scale) * k;
  const x = from.x + (to.x - from.x) * k;
  const y = from.y + (to.y - from.y) * k;
  if (!allowFast && frame === 0) {
    // peak speed of a sine ease is pi/2 x the average; check the visible frame edge's travel
    const travel = Math.hypot(to.x - from.x, to.y - from.y) + Math.abs(1 / from.scale - 1 / to.scale) / 2;
    const peak = (travel / (durationInFrames / fps)) * (Math.PI / 2);
    if (peak > FILM.move.max_width_per_s) console.warn(`Still ${src}: peak move ${(peak * 100).toFixed(1)}%/s of width`);
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      {/* children (overlays such as a needle or a bulb) move with the image: coordinates are image fractions */}
      <div style={{position: 'absolute', width: iw, height: ih, left: (PIC_W - iw) / 2, top: (PIC_H - ih) / 2,
        transform: `translate(${-x * PIC_W}px, ${-y * PIC_H}px) scale(${s})`, transformOrigin: 'center'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', width: iw, height: ih}} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Clip: generated video, optionally over-cranked ---------- */

/** Clips are 4 s; a longer shot loops it (brief: loop or re-cut rather than generate more), mirrored on every
 * other pass so the repeat reads as a new angle rather than a jump. */
export const CLIP_FRAMES = 97;
export const Clip: React.FC<{src: string; rate?: number; startFrom?: number; mirror?: boolean; frames?: number}> =
  ({src, rate = 1, startFrom = 0, mirror = true, frames = CLIP_FRAMES}) => {
  const frame = useCurrentFrame();
  const pass = Math.floor((frames - startFrom) / rate);
  const k = Math.floor(frame / Math.max(1, pass));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Loop durationInFrames={Math.max(1, pass)}>
        <AbsoluteFill style={{transform: mirror && k % 2 ? 'scaleX(-1)' : undefined}}>
          <OffthreadVideo src={staticFile(src)} playbackRate={rate} startFrom={startFrom} muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      </Loop>
    </AbsoluteFill>
  );
};

/* ---------- Intertitle card: white on black, thin Art Deco border ---------- */

const DecoBorder: React.FC = () => {
  const m = 46, c = 34; // margin, stepped-corner size
  const W = PIC_W - 2 * m, H = PIC_H - 2 * m;
  const stepped = (o: number) => {
    const x0 = m + o, y0 = m + o, x1 = m + W - o, y1 = m + H - o, k = c - o * 0.6;
    return `M${x0 + k},${y0} H${x1 - k} V${y0 + k / 2} H${x1 - k / 2} V${y0 + k} H${x1} V${y1 - k} H${x1 - k / 2} V${y1 - k / 2} H${x1 - k} V${y1} H${x0 + k} V${y1 - k / 2} H${x0 + k / 2} V${y1 - k} H${x0} V${y0 + k} H${x0 + k / 2} V${y0 + k / 2} H${x0 + k} Z`;
  };
  return (
    <svg width={PIC_W} height={PIC_H} style={{position: 'absolute', inset: 0}}>
      <path d={stepped(0)} fill="none" stroke="#e8e4da" strokeWidth={3} />
      <path d={stepped(14)} fill="none" stroke="#e8e4da" strokeWidth={1.2} />
      {[0.5].map((f) => (
        <g key={f} stroke="#e8e4da" strokeWidth={1.2}>
          <line x1={PIC_W * f - 70} y1={m + 30} x2={PIC_W * f + 70} y2={m + 30} />
          <line x1={PIC_W * f - 70} y1={PIC_H - m - 30} x2={PIC_W * f + 70} y2={PIC_H - m - 30} />
          <path d={`M${PIC_W * f},${m + 22} l8,8 l-8,8 l-8,-8 Z`} fill="#e8e4da" />
          <path d={`M${PIC_W * f},${PIC_H - m - 38} l8,8 l-8,8 l-8,-8 Z`} fill="#e8e4da" />
        </g>
      ))}
    </svg>
  );
};

/** variant "display": short Deco line (Limelight). "body": longer fact text (Old Standard). Auto-sized to fit. */
/** captionSafe: the text keeps clear of the burned-in caption, which rises inside the border on cards. */
export const Card: React.FC<{text: string; variant?: 'display' | 'body'; captionSafe?: boolean}> = ({text, variant, captionSafe}) => {
  const v = variant ?? (text.split(/\s+/).length > 8 ? 'body' : 'display');
  // Fit the text box (~1100 x 780 px): lines x line-height <= height, with average glyph width ~0.5 em (Old Standard)
  // or ~0.62 em (Limelight). size <= sqrt(W * H / (glyph * lineHeight * chars)), with a 10% margin.
  const chars = text.length;
  const glyph = v === 'display' ? 0.62 : 0.5, lh = v === 'display' ? 1.15 : 1.32;
  const fit = 0.9 * Math.sqrt((1100 * 780) / (glyph * lh * chars));
  const size = Math.min(v === 'display' ? 118 : 84, fit);
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <DecoBorder />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: captionSafe ? '150px 170px 200px' : '150px 170px'}}>
        <div style={{color: '#efebe1', textAlign: 'center', lineHeight: v === 'display' ? 1.15 : 1.32,
          fontFamily: v === 'display' ? 'Limelight' : 'Old Standard TT', fontSize: size,
          letterSpacing: v === 'display' ? '0.03em' : 0}}>
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Film leader: 5-4-3-2 countdown with a sweeping hand ---------- */

export const Leader: React.FC<{from?: number; to?: number}> = ({from = 5, to = 2}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n = from - to + 1;
  const per = durationInFrames / n;
  const i = Math.min(n - 1, Math.floor(frame / per));
  const num = from - i;
  const sweep = ((frame - i * per) / per) * 360;
  const cx = PIC_W / 2, cy = PIC_H / 2, r = 420;
  return (
    <AbsoluteFill style={{background: '#8a8a86'}}>
      <div style={{position: 'absolute', left: cx - r * 1.6, top: cy - r * 1.6, width: r * 3.2, height: r * 3.2,
        borderRadius: '50%', background: `conic-gradient(from 0deg, #b9b9b4 0deg ${sweep}deg, #8a8a86 ${sweep}deg 360deg)`}} />
      <svg width={PIC_W} height={PIC_H} style={{position: 'absolute', inset: 0}}>
        <line x1={0} y1={cy} x2={PIC_W} y2={cy} stroke="#1a1a1a" strokeWidth={3} />
        <line x1={cx} y1={0} x2={cx} y2={PIC_H} stroke="#1a1a1a" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f2f2ee" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r - 34} fill="none" stroke="#f2f2ee" strokeWidth={4} />
        <line x1={cx} y1={cy} x2={cx + Math.sin((sweep * Math.PI) / 180) * r * 1.6}
          y2={cy - Math.cos((sweep * Math.PI) / 180) * r * 1.6} stroke="#1a1a1a" strokeWidth={4} />
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: 'Old Standard TT', fontSize: 560, color: '#111', lineHeight: 1}}>{num}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Iris: a circular open or close ---------- */

export const Iris: React.FC<{children: React.ReactNode; mode: 'open' | 'close'; durationFrames: number; startFrame?: number}> =
  ({children, mode, durationFrames, startFrame = 0}) => {
    const frame = useCurrentFrame();
    const k = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
      easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const full = Math.hypot(PIC_W, PIC_H) / 2;
    const r = (mode === 'open' ? k : 1 - k) * full;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  };

/* ---------- Film burn: white holes bloom out of the frame and spread until the picture is gone, then black ---------- */

export const Burn: React.FC<{durationFrames: number; startFrame?: number; seedOffset?: number}> =
  ({durationFrames, startFrame = 0, seedOffset = 0}) => {
    const frame = useCurrentFrame();
    const t = (frame - startFrame) / durationFrames; // 0..1
    if (t < 0) return null;
    const tail = FILM.burn.black_tail;
    if (t >= 1 - tail) return <AbsoluteFill style={{background: '#000'}} />;
    const u = t / (1 - tail); // 0..1 over the burning part
    const holes = Array.from({length: FILM.burn.holes}, (_, i) => {
      const st = 500 + seedOffset;
      const t0 = hash(SEED, st, i) * 0.55;                  // when this hole starts
      const x = (0.15 + 0.7 * hash(SEED, st + 1, i)) * PIC_W;
      const y = (0.15 + 0.7 * hash(SEED, st + 2, i)) * PIC_H;
      // each hole opens from a pinprick and accelerates: r = rmax * ((u - t0) / (1 - t0))^power
      const power = 2.0 + 1.2 * hash(SEED, st + 3, i);
      const rmax = PIC_W * (0.45 + 0.35 * hash(SEED, st + 4, i));
      const r = u < t0 ? 0 : 4 + rmax * Math.pow((u - t0) / (1 - t0), power);
      return {i, x, y, r};
    }).filter((h) => h.r > 0);
    const whiteout = Math.max(0, (u - 0.9) / 0.1); // last moment: the whole frame flares white
    return (
      <AbsoluteFill>
        <svg width={PIC_W} height={PIC_H} style={{position: 'absolute', inset: 0}}>
          <defs>
            {/* Two passes so merged holes read as one white area: scorched rims first, white cores on top. */}
            <radialGradient id="burnrim">
              <stop offset="0%" stopColor="#111" stopOpacity={1} />
              <stop offset="80%" stopColor="#111" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#000" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="burncore">
              <stop offset="0%" stopColor="#fff" stopOpacity={1} />
              <stop offset="80%" stopColor="#fff" stopOpacity={1} />
              <stop offset="100%" stopColor="#d0d0d0" stopOpacity={1} />
            </radialGradient>
            <filter id="burnrough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={SEED % 1000} />
              <feDisplacementMap in="SourceGraphic" scale={38} /></filter>
          </defs>
          <g filter="url(#burnrough)">
            {holes.map((h) => <circle key={`r${h.i}`} cx={h.x} cy={h.y} r={h.r * 1.22 + 6} fill="url(#burnrim)" />)}
            {holes.map((h) => <circle key={`c${h.i}`} cx={h.x} cy={h.y} r={h.r} fill="url(#burncore)" />)}
          </g>
        </svg>
        <AbsoluteFill style={{background: '#fff', opacity: whiteout}} />
      </AbsoluteFill>
    );
  };
