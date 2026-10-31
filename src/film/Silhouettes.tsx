import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import tmap from '../../timing/timing_map.json';
import {FPS, PIC_H, PIC_W, SEED} from '../config';
import {hash} from './rand';

/**
 * Jointed paper-cutout silhouettes (type K): black card figures on a pale stage, limbs hinged at shoulder, elbow,
 * hip and knee, posed per frame. Moves are locked to the band's beat grid (timing/timing_map.json), so kicks land
 * on the beat. Used for N23 (band + kick line) and N28 (crowd running), and as the brief's fallback for dance clips.
 */

const BEATS: number[] = (tmap as any).beats.band.beats;

/** Beat phase at master time t: integer beat index + fraction (0 at the beat). */
const beatPhase = (t: number) => {
  let i = 0;
  while (i + 1 < BEATS.length && BEATS[i + 1] <= t) i++;
  const a = BEATS[i], b = BEATS[i + 1] ?? a + 0.267;
  return {i, f: Math.max(0, Math.min(1, (t - a) / (b - a)))};
};

type Pose = {lShoulder: number; lElbow: number; rShoulder: number; rElbow: number; lHip: number; lKnee: number;
  rHip: number; rKnee: number; lean?: number};

const Limb: React.FC<{x: number; y: number; a1: number; a2: number; l1: number; l2: number; w: number}> =
  ({x, y, a1, a2, l1, l2, w}) => {
    const r = Math.PI / 180;
    const x1 = x + Math.sin(a1 * r) * l1, y1 = y + Math.cos(a1 * r) * l1;
    const x2 = x1 + Math.sin((a1 + a2) * r) * l2, y2 = y1 + Math.cos((a1 + a2) * r) * l2;
    return (
      <g stroke="#0b0b0b" strokeWidth={w} strokeLinecap="round" fill="none">
        <path d={`M${x},${y} L${x1},${y1} L${x2},${y2}`} strokeLinejoin="round" />
      </g>
    );
  };

/** One figure, feet at (x, baseline), height h. kind adds a prop: hat, skirt, horn. */
const Figure: React.FC<{x: number; base: number; h: number; p: Pose; skirt?: boolean; horn?: 'clarinet' | 'trumpet'; flip?: boolean}> =
  ({x, base, h, p, skirt, horn, flip}) => {
    const u = h / 10;
    const hipY = base - 4.6 * u, neckY = base - 8.0 * u;
    const w = 0.72 * u;
    return (
      <g transform={`translate(${x},0) scale(${flip ? -1 : 1},1) rotate(${p.lean ?? 0} 0 ${hipY})`}>
        <Limb x={-0.38 * u} y={hipY} a1={-p.lHip} a2={-p.lKnee} l1={2.3 * u} l2={2.3 * u} w={w} />
        <Limb x={0.38 * u} y={hipY} a1={p.rHip} a2={p.rKnee} l1={2.3 * u} l2={2.3 * u} w={w} />
        <path d={`M${-0.9 * u},${neckY} L${0.9 * u},${neckY} L${0.7 * u},${hipY} L${-0.7 * u},${hipY} Z`} fill="#0b0b0b" />
        {skirt && <path d={`M${-0.8 * u},${hipY - 0.6 * u} L${0.8 * u},${hipY - 0.6 * u} L${1.5 * u},${hipY + 1.4 * u} L${-1.5 * u},${hipY + 1.4 * u} Z`} fill="#0b0b0b" />}
        {/* shoulder angle 0 = arm hanging down; positive swings outward (left arm to the left) */}
        <Limb x={-0.75 * u} y={neckY + 0.35 * u} a1={-p.lShoulder} a2={-p.lElbow} l1={1.7 * u} l2={1.6 * u} w={0.55 * u} />
        <Limb x={0.75 * u} y={neckY + 0.35 * u} a1={p.rShoulder} a2={p.rElbow} l1={1.7 * u} l2={1.6 * u} w={0.55 * u} />
        <circle cx={0} cy={neckY - 0.95 * u} r={0.85 * u} fill="#0b0b0b" />
        {!skirt && <rect x={-0.95 * u} y={neckY - 2.25 * u} width={1.9 * u} height={0.75 * u} rx={0.1 * u} fill="#0b0b0b" />}
        {!skirt && <rect x={-1.4 * u} y={neckY - 1.6 * u} width={2.8 * u} height={0.18 * u} fill="#0b0b0b" />}
        {horn && <path d={horn === 'trumpet'
          ? `M${0.5 * u},${neckY - 0.9 * u} L${3.4 * u},${neckY - 1.4 * u} L${4.3 * u},${neckY - 2.0 * u} L${4.3 * u},${neckY - 0.6 * u} L${3.4 * u},${neckY - 1.1 * u} Z`
          : `M${0.4 * u},${neckY - 0.7 * u} L${2.6 * u},${neckY + 2.4 * u} L${3.1 * u},${neckY + 3.0 * u} L${2.3 * u},${neckY + 2.8 * u} Z`} fill="#0b0b0b" />}
      </g>
    );
  };

/** The Charleston: swivel and kick, one cycle per two beats. */
const charleston = (f: number, side: number): Pose => {
  const s = Math.sin(f * Math.PI) * side;                 // -1..1 over two beats
  const kick = Math.max(0, Math.sin(f * Math.PI * 2));      // a kick on each beat
  const leftKicks = Math.sin(f * Math.PI * 2) > 0 === side > 0;
  return {lShoulder: 35 + 35 * s, lElbow: 40 + 30 * kick, rShoulder: 35 - 35 * s, rElbow: 40 + 30 * kick,
    lHip: 6 + (leftKicks ? 50 * kick : 0), lKnee: leftKicks ? -35 * kick : 0,
    rHip: 6 + (!leftKicks ? 50 * kick : 0), rKnee: !leftKicks ? 35 * kick : 0, lean: 5 * s};
};

const run = (f: number, phase: number): Pose => {
  const s = Math.sin((f + phase) * Math.PI * 2);
  // side view, facing right: both legs and arms swing forward/back (opposite phase)
  return {lShoulder: -50 * s, lElbow: -70, rShoulder: 50 * s, rElbow: 70, lHip: -40 * s, lKnee: 60 * Math.max(0, s) + 8,
    rHip: -40 * -s, rKnee: 60 * Math.max(0, -s) + 8, lean: 12};
};

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #f1ece0 0%, #d8d1c2 70%, #bdb5a5 100%)'}}>
    <svg width={PIC_W} height={PIC_H} style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={PIC_H * 0.86} width={PIC_W} height={PIC_H * 0.14} fill="#0b0b0b" />
      {children}
    </svg>
  </AbsoluteFill>
);

/** N23: clarinet and trumpet trade breaks on a riser (each plays for two bars, then the other), kick line below. */
export const SilhouetteBand: React.FC<{startS: number}> = ({startS}) => {
  const frame = useCurrentFrame();
  const t = startS + frame / FPS;
  const {i, f} = beatPhase(t);
  const two = ((i % 2) + f) / 2;                            // 0..1 over two beats
  const trading = Math.floor(i / 8) % 2;                    // who has the break: 0 clarinet, 1 trumpet
  // playing: both hands up at the instrument and the player sways; resting: arms down
  const player = (on: boolean, horn: 'clarinet' | 'trumpet') => ({lShoulder: on ? -60 : 8, lElbow: on ? -80 : 10, rShoulder: on ? 70 : 8,
    rElbow: on ? 80 : 10, lHip: 6, lKnee: 0, rHip: 6, rKnee: 0, lean: on ? -6 + 6 * Math.sin(two * Math.PI * 2) : 0});
  return (
    <Stage>
      <rect x={PIC_W * 0.18} y={PIC_H * 0.44} width={PIC_W * 0.64} height={18} fill="#0b0b0b" />
      <Figure x={PIC_W * 0.36} base={PIC_H * 0.44} h={300} p={player(trading === 0, 'clarinet')} horn="clarinet" />
      <Figure x={PIC_W * 0.64} base={PIC_H * 0.44} h={300} p={player(trading === 1, 'trumpet')} horn="trumpet" flip />
      {Array.from({length: 6}, (_, k) => (
        <Figure key={k} x={PIC_W * (0.12 + k * 0.152)} base={PIC_H * 0.86} h={330} p={charleston(two, k % 2 ? 1 : -1)} skirt={k % 2 === 0} />
      ))}
    </Stage>
  );
};

/** N28: a crowd runs across the frame, left to right, at mixed speeds ("what's everybody runnin' for?"). */
export const SilhouetteCrowd: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <Stage>
      {Array.from({length: 16}, (_, k) => {
        const speed = 380 + 260 * hash(SEED, 900, k);
        const span = PIC_W + 500;                         // spread across the frame; wrap around
        const x = ((hash(SEED, 901, k) * span + speed * t) % span) - 250;
        const h = 260 + 120 * hash(SEED, 902, k);
        const base = PIC_H * (0.8 + 0.06 * hash(SEED, 903, k));
        return <Figure key={k} x={x} base={base} h={h} p={run(t * (speed / 320), hash(SEED, 904, k))} skirt={k % 3 === 0} />;
      })}
    </Stage>
  );
};
