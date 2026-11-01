import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import edit from '../config/edit.json';
import picks from '../config/picks_manifest.json';
import times from '../timing/shot_times.json';
import tmap from '../timing/timing_map.json';
import chatCap from '../config/chat_capture.json';
import {CARDS, FPS, PIC_H, PIC_W} from './config';
import {FilmLayer} from './film/FilmLayer';
import {Burn, Card, Clip, Frame, Iris, Leader, Still} from './film/devices';
import {Fonts} from './Fonts';
import {SilhouetteBand, SilhouetteCrowd} from './film/Silhouettes';
import {Captions} from './Captions';

/**
 * M4/M5: the whole video. Timing from timing/shot_times.json (M1), content from config/edit.json, media under
 * public/. Anything whose file isn't in config/picks_manifest.json renders as a labelled placeholder, so the
 * animatic can be cut before every take is picked.
 */

type Shot = {start: number; end: number; start_frame: number; end_frame: number; insert_over?: string};
const SHOTS = times.shots as Record<string, Shot>;
const EDIT = (edit as any).shots as Record<string, any>;
const HAVE = new Set<string>((picks as any).files);
export const MAIN_FRAMES = (times as any).video_end_frame as number;
const BEATS: number[] = (tmap as any).beats.band.beats;

const has = (src?: string) => !!src && HAVE.has(src);
const SIZES = ((picks as any).sizes ?? {}) as Record<string, [number, number]>;
const aspect = (src: string) => (SIZES[src] ? SIZES[src][0] / SIZES[src][1] : undefined);

const Placeholder: React.FC<{id: string; what: string}> = ({id, what}) => (
  <AbsoluteFill style={{background: '#2a2a2a', alignItems: 'center', justifyContent: 'center', padding: 120}}>
    <div style={{fontFamily: 'Old Standard TT', color: '#ddd', fontSize: 64, textAlign: 'center'}}>
      <div style={{fontSize: 110}}>{id}</div>
      <div>{what}</div>
    </div>
  </AbsoluteFill>
);

const StillOr: React.FC<{id: string; s: any; children?: React.ReactNode}> = ({id, s, children}) =>
  has(s.src) ? <Still src={s.src} from={s.from} to={s.to} allowFast={s.allowFast} aspect={aspect(s.src)}>{children}</Still> : <Placeholder id={id} what={`still ${s.src}`} />;

/** Clip if generated, else its keyframe still with a slow push, else a placeholder. */
const ClipOr: React.FC<{id: string; src: string; fallback?: string; rate?: number; startFrom?: number}> =
  ({id, src, fallback, rate, startFrom}) => {
    if (has(src)) return <Clip src={src} rate={rate} startFrom={startFrom} />;
    if (has(fallback)) return <Still src={fallback!} aspect={aspect(fallback!)} from={{scale: 1, x: 0, y: 0}} to={{scale: 1.06, x: 0, y: 0}} />;
    return <Placeholder id={id} what={`clip ${src}`} />;
  };

const CornerCaption: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', right: 70, top: 60, padding: '10px 22px', background: 'rgba(0,0,0,0.78)',
    border: '1.5px solid #e8e4da', color: '#efebe1', fontFamily: 'Old Standard TT', fontStyle: 'italic', fontSize: 40}}>
    {text}
  </div>
);

const OverlayCard: React.FC<{text: string}> = ({text}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
    <div style={{background: 'rgba(0,0,0,0.82)', border: '2px solid #e8e4da', padding: '18px 36px', color: '#efebe1',
      fontFamily: 'Limelight', fontSize: 44, textAlign: 'center', maxWidth: PIC_W - 240}}>{text}</div>
  </AbsoluteFill>
);

/** Zoom through nested stills: each one scales up until the next fills the frame. */
const ZoomThrough: React.FC<{id: string; srcs: string[]}> = ({id, srcs}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const seg = durationInFrames / srcs.length;
  const i = Math.min(srcs.length - 1, Math.floor(frame / seg));
  const k = (frame - i * seg) / seg;
  const src = srcs[i];
  if (!has(src)) return <Placeholder id={id} what={`zoom ${src}`} />;
  return <Img src={staticFile(src)} style={{width: PIC_W, height: PIC_H, objectFit: 'cover',
    transform: `scale(${1 + k * k * 1.4})`, transformOrigin: '50% 48%'}} />;
};

/** Ticker tape piled on the floor, rising shot by shot (ankle in N12, knee in N18): the generated tape-pile still
 * (white paper on pure black) laid over the bottom of the frame with a lighten blend, so only the paper shows. */
const TapePile: React.FC<{level: number}> = ({level}) => {
  const src = EDIT.N12?.tape_src ?? 'media/picks/tape_pile.png';
  if (!has(src)) return null;
  // The heap in the image peaks 25% down from its top (measured; its sides fall to ~55%). Six small copies at natural
  // aspect (so paper strips stay small next to the dancers), alternately mirrored, each sunk so its peak stands
  // ~`level` of the frame above the bottom: together an uneven drift. contrast/brightness crush the image's dark floor
  // to black so the lighten blend shows only paper.
  const sz = SIZES[src] ?? [2208, 1248];
  const n = 6;
  return (
    <>
      {Array.from({length: n}, (_, k) => {
        const r = (m: number) => ((Math.sin((k + 1) * 12.9898 + m * 78.233) * 43758.5453) % 1 + 1) % 1;
        const w = PIC_W * (0.38 + 0.1 * r(1));
        const h = (w * sz[1]) / sz[0];
        const peak = level * PIC_H * (0.85 + 0.3 * r(2));
        const bottom = peak - 0.75 * h;
        const left = -0.12 * PIC_W + (k / (n - 1)) * 1.04 * PIC_W - w / 2 + (r(3) - 0.5) * 0.08 * PIC_W;
        return <Img key={k} src={staticFile(src)} style={{position: 'absolute', left, bottom, width: w, height: h,
          transform: k % 2 ? 'scaleX(-1)' : undefined, mixBlendMode: 'lighten', filter: 'contrast(2.2) brightness(0.85)'}} />;
      })}
    </>
  );
};

/** N06: the thinking machine's one bulb blinks (code overlay). Position from config/edit.json. */
const Bulb: React.FC<{x?: number; y?: number}> = ({x = 0.5, y = 0.2}) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 9) % 2 === 0;
  // x, y: fractions of the image (drawn inside the Still's image box, which may be wider or taller than 4:3)
  return <div style={{position: 'absolute', left: `calc(${x * 100}% - 40px)`, top: `calc(${y * 100}% - 40px)`, width: 80, height: 80, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 70%)', opacity: on ? 1 : 0.1}} />;
};

/** N24: the rate dial's needle climbs (code overlay). A period gauge hand: a blackened steel spade-tipped pointer
 * with a counterweight tail, under a domed brass cap with a centre rivet (not a modern stick-and-dot). */
const Needle: React.FC<{x?: number; y?: number; r?: number}> = ({x = 0.62, y = 0.4, r = 0.13}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const a = interpolate(frame, [0, durationInFrames], [-110, 95], {easing: (t) => t * t * (3 - 2 * t)});
  const L = r * PIC_W;                     // pointer length (px, image space at 1440 wide)
  const cx = x * PIC_W, cy = y * PIC_H;
  const w = L * 0.035;                     // shaft half-width at the hub
  const hand = [
    `M ${-w * 0.5},${L * 0.22}`,                                   // tail end
    `L ${-w},${0}`, `L ${-w * 0.45},${-L * 0.70}`,                 // shaft tapers toward the tip
    `L ${-w * 2.6},${-L * 0.74}`, `L 0,${-L}`, `L ${w * 2.6},${-L * 0.74}`,   // spade tip
    `L ${w * 0.45},${-L * 0.70}`, `L ${w},${0}`, `L ${w * 0.5},${L * 0.22}`, 'Z',
  ].join(' ');
  return (
    <svg viewBox={`0 0 ${PIC_W} ${PIC_H}`} preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
      <defs>
        <radialGradient id="brasscap" cx="38%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f6eccb" /><stop offset="45%" stopColor="#b89a55" /><stop offset="100%" stopColor="#4a3a18" />
        </radialGradient>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${a})`}>
        <path d={hand} fill="#000" opacity={0.25} transform={`translate(${L * 0.012} ${L * 0.02})`} />
        <path d={hand} fill="#141414" stroke="#3a3a3a" strokeWidth={1} />
        <circle cx={0} cy={L * 0.2} r={L * 0.07} fill="#141414" stroke="#3a3a3a" strokeWidth={1} />
      </g>
      <circle cx={cx} cy={cy} r={L * 0.095} fill="url(#brasscap)" stroke="#2a2010" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={L * 0.022} fill="#2a2010" />
    </svg>
  );
};

/** Generated shadow-play footage as silhouettes: a pale stage, each matte (black figures on white) multiplied on. */
const MatteStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #f1ece0 0%, #d8d1c2 70%, #bdb5a5 100%)'}}>
    {children}
  </AbsoluteFill>
);
const MatteLayer: React.FC<{src: string; frames: number; box: {x: number; y: number; w: number; h: number}; mirror?: boolean}> =
  ({src, frames, box, mirror = false}) => (
    <div style={{position: 'absolute', left: box.x * PIC_W, top: box.y * PIC_H, width: box.w * PIC_W, height: box.h * PIC_H,
      mixBlendMode: 'multiply', overflow: 'hidden'}}>
      <Clip src={src} frames={frames} mirror={mirror} />
    </div>
  );

const Credits: React.FC = () => <Card text={CARDS.N34.text} variant="body" />;

/** Montage of clips cut on beats; 'beat_accel' over-cranks and shortens the cuts towards the end. */
const Montage: React.FC<{id: string; e: any; startS: number}> = ({id, e, startS}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = startS + frame / FPS;
  const bs = BEATS.filter((b) => b >= startS && b < startS + durationInFrames / FPS);
  const step = e.cut === 'bar' ? 4 : 2;
  const cuts = bs.filter((_, i) => i % step === 0);
  const k = Math.max(0, cuts.findIndex((c, i) => t >= c && (i + 1 === cuts.length || t < cuts[i + 1])));
  const src = e.srcs[k % e.srcs.length];
  const prog = frame / durationInFrames;
  const rate = e.rate ?? (e.rate_from + (e.rate_to - e.rate_from) * prog);
  return <ClipOr id={id} src={src} fallback={src.replace(/(C\d\w?)\.mp4$/, 'kf_$1.png')} rate={rate} startFrom={(k * 13) % 48} />;
};

const ShotContent: React.FC<{id: string}> = ({id}) => {
  const e = EDIT[id];
  const s = SHOTS[id];
  const dur = s.end_frame - s.start_frame;
  if (!e) return <Placeholder id={id} what="no edit entry" />;
  switch (e.kind) {
    case 'leader':
      return <Leader />;
    case 'card':
      return <Card text={CARDS[e.card].text} captionSafe />;
    case 'still': {
      const body = (
        <AbsoluteFill>
          <StillOr id={id} s={e}>
            {e.overlay === 'bulb' && <Bulb {...(e.overlay_pos ?? {})} />}
            {e.overlay === 'dial' && <Needle {...(e.overlay_pos ?? {})} />}
          </StillOr>
          {e.caption && <CornerCaption text={CARDS[e.caption].text} />}
        </AbsoluteFill>
      );
      return e.iris_open_frames ? <Iris mode="open" durationFrames={e.iris_open_frames}>{body}</Iris> : body;
    }
    case 'card_then_still': {
      const cf = Math.round(e.card_s * FPS);
      return (
        <>
          <Sequence durationInFrames={cf}><Card text={CARDS[e.card].text} captionSafe /></Sequence>
          <Sequence from={cf}><StillOr id={id} s={e.still} /></Sequence>
        </>
      );
    }
    case 'clip':
      return (
        <AbsoluteFill>
          <ClipOr id={id} src={e.src} fallback={e.fallback_still} />
          {e.overlay === 'tape_ankle' && <TapePile level={0.08} />}
        </AbsoluteFill>
      );
    case 'clip_montage':
      return (
        <AbsoluteFill>
          <Montage id={id} e={e} startS={s.start} />
          {e.overlay === 'tape_knee' && <TapePile level={0.2} />}
        </AbsoluteFill>
      );
    case 'dissolve': {
      const df = Math.round(e.dissolve_s * FPS);
      return (
        <AbsoluteFill>
          {has(e.a) ? <Still src={e.a} from={e.from} to={e.to} aspect={aspect(e.a)} /> : <Placeholder id={id} what={`still ${e.a}`} />}
          <Sequence from={Math.max(0, Math.round(dur * 0.35))} durationInFrames={dur}>
            <Fade frames={df}>{has(e.b) ? <Still src={e.b} from={e.from} to={e.to} aspect={aspect(e.b)} /> : <Placeholder id={id} what={`still ${e.b}`} />}</Fade>
          </Sequence>
        </AbsoluteFill>
      );
    }
    case 'zoom_through':
      return (
        <AbsoluteFill>
          <ZoomThrough id={id} srcs={e.srcs} />
          {e.overlay_card && <OverlayCard text={CARDS[e.overlay_card].text} />}
        </AbsoluteFill>
      );
    case 'freeze_card':
      return (
        <AbsoluteFill>
          <Freeze frame={Math.round(e.freeze_at_s * FPS)}><ClipOr id={id} src={e.src} fallback={e.src.replace(/(C\d\w?)\.mp4$/, 'kf_$1.png')} /></Freeze>
          <OverlayCard text={CARDS[e.card].text} />
        </AbsoluteFill>
      );
    case 'insert':
      return has(e.src) ? <Img src={staticFile(e.src)} style={{width: PIC_W, height: PIC_H, objectFit: 'cover'}} /> : <Placeholder id={id} what="insert" />;
    case 'silhouette_band':
      return has(e.mattes?.band) && has(e.mattes?.kick) ? (
        <MatteStage>
          {/* the band on a riser in the upper frame (the matte's feet sit ~88% down its box), the kick line below */}
          <MatteLayer src={e.mattes.band} frames={e.matte_frames} box={{x: 0.22, y: -0.02, w: 0.56, h: 0.47}} />
          <div style={{position: 'absolute', left: PIC_W * 0.2, top: PIC_H * 0.395, width: PIC_W * 0.6, height: 14, background: '#0b0b0b'}} />
          <div style={{position: 'absolute', left: PIC_W * 0.23, top: PIC_H * 0.395, width: 10, height: PIC_H * 0.08, background: '#0b0b0b'}} />
          <div style={{position: 'absolute', left: PIC_W * 0.77 - 10, top: PIC_H * 0.395, width: 10, height: PIC_H * 0.08, background: '#0b0b0b'}} />
          <MatteLayer src={e.mattes.kick} frames={e.matte_frames} box={{x: 0.02, y: 0.43, w: 0.96, h: 0.6}} />
        </MatteStage>
      ) : <SilhouetteBand startS={s.start} />;
    case 'silhouette_crowd':
      return has(e.mattes?.run) ? (
        <MatteStage><MatteLayer src={e.mattes.run} frames={e.matte_frames} mirror={false} box={{x: -0.05, y: 0.05, w: 1.1, h: 1.0}} /></MatteStage>
      ) : <SilhouetteCrowd />;
    case 'freeze_burn':
      return (
        <AbsoluteFill>
          <Freeze frame={Math.round(e.freeze_at_s * FPS)}><ClipOr id={id} src={e.src} fallback={e.src.replace(/(C\d\w?)\.mp4$/, 'kf_$1.png')} /></Freeze>
          <Burn startFrame={Math.max(0, dur - Math.round(dur * 0.95))} durationFrames={Math.round(dur * 0.95)} />
        </AbsoluteFill>
      );
    case 'chat_zoom':
      return null; // drawn outside the film layer (see Main): the newsreel shrinks into the real chat
    case 'credits':
      return <Credits />;
    default:
      return <Placeholder id={id} what={e.kind} />;
  }
};

const Fade: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(frame, [0, frames], [0, 1], {extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};

/** B01: the newsreel frame (the coda still, filmed) shrinks away to reveal the planning chat, centred on the coda line. */
const ChatZoom: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const e = EDIT.B01;
  const cap = chatCap as any; // page px (css) at scale 2, viewport 1280x960 -> image 2560x1920
  const W = 1920, H = W * 0.75;                       // chat image shown 1920x1440 (cover)
  const tx = (cap.box.x + cap.box.w / 2) * (W / cap.viewport[0]);
  const ty = (cap.box.y + cap.box.h / 2) * (H / cap.viewport[1]);
  const left = 960 - tx, top = 540 - ty;              // the coda line sits at the frame centre
  const k = interpolate(frame, [0, dur * 0.75], [0, 1], {extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  const chatScale = interpolate(k, [0, 1], [2.6, 1]);
  const picScale = interpolate(k, [0, 1], [1, 0.0]);
  return (
    <AbsoluteFill style={{background: '#faf9f5', overflow: 'hidden'}}>
      {has(e.chat_src) && (
        <Img src={staticFile(e.chat_src)} style={{position: 'absolute', left, top, width: W, height: H,
          transform: `scale(${chatScale})`, transformOrigin: `${tx}px ${ty}px`}} />
      )}
      <AbsoluteFill style={{transform: `scale(${picScale})`, transformOrigin: '50% 50%'}}>
        <FilmLayer>
          {has(e.still_src) ? <Still src={e.still_src} from={{scale: 1, x: 0, y: 0}} to={{scale: 1, x: 0, y: 0}} /> : <Placeholder id="B01" what="coda still" />}
        </FilmLayer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Draft overlay for reviews: shot ID and timecode in the left pillarbox, outside the picture. */
const DraftLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const id = Object.keys(SHOTS).filter((k) => !SHOTS[k].insert_over).find((k) => frame >= SHOTS[k].start_frame && frame < SHOTS[k].end_frame) ?? '';
  const ins = Object.keys(SHOTS).find((k) => SHOTS[k].insert_over && frame >= SHOTS[k].start_frame && frame < SHOTS[k].end_frame);
  const mm = Math.floor(t / 60), ss = (t % 60).toFixed(2).padStart(5, '0');
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 240, height: 1080, color: '#9a9a9a', fontFamily: 'monospace',
      fontSize: 34, padding: 24, lineHeight: 1.5}}>
      <div style={{color: '#e8e4da', fontSize: 52}}>{ins ?? id}</div>
      <div>{mm}:{ss}</div>
      <div style={{fontSize: 24}}>f{frame}</div>
    </div>
  );
};

/** Frame ranges where a full-frame intertitle is up: captions rise inside its border there (Captions "raised"). */
const CARD_FRAMES: [number, number][] = Object.keys(SHOTS).flatMap((k) => {
  const e = EDIT[k], s = SHOTS[k];
  if (e?.kind === 'card') return [[s.start_frame, s.end_frame] as [number, number]];
  if (e?.kind === 'card_then_still') return [[s.start_frame, s.start_frame + Math.round(e.card_s * FPS)] as [number, number]];
  return [];
});

export const Main: React.FC<{draft?: boolean; captions?: boolean; audio?: boolean}> = ({draft, captions = true, audio = true}) => {
  const order = Object.keys(SHOTS).filter((k) => !SHOTS[k].insert_over && k !== 'B01');
  const inserts = Object.keys(SHOTS).filter((k) => SHOTS[k].insert_over);
  const b = SHOTS.B01;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fonts />
      {audio && <Audio src={staticFile('audio/master_padded.wav')} />}
      <Sequence durationInFrames={b.start_frame}>
        <FilmLayer>
          {order.filter((k) => SHOTS[k].start_frame < b.start_frame).map((k) => (
            <Sequence key={k} from={SHOTS[k].start_frame} durationInFrames={SHOTS[k].end_frame - SHOTS[k].start_frame} name={k}>
              <ShotContent id={k} />
            </Sequence>
          ))}
          {inserts.map((k) => (
            <Sequence key={k} from={SHOTS[k].start_frame} durationInFrames={Math.max(1, SHOTS[k].end_frame - SHOTS[k].start_frame)} name={k}>
              <ShotContent id={k} />
            </Sequence>
          ))}
        </FilmLayer>
      </Sequence>
      <Sequence from={b.start_frame} durationInFrames={b.end_frame - b.start_frame} name="B01">
        <ChatZoom dur={b.end_frame - b.start_frame} />
      </Sequence>
      <Sequence from={b.end_frame} name="end">
        <FilmLayer>
          {order.filter((k) => SHOTS[k].start_frame >= b.end_frame).map((k) => (
            <Sequence key={k} from={SHOTS[k].start_frame - b.end_frame} durationInFrames={SHOTS[k].end_frame - SHOTS[k].start_frame} name={k}>
              <ShotContent id={k} />
            </Sequence>
          ))}
        </FilmLayer>
      </Sequence>
      {captions && <Captions raised={CARD_FRAMES} />}
      {draft && <DraftLabel />}
    </AbsoluteFill>
  );
};
