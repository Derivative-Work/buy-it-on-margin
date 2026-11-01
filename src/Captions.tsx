import React from 'react';
import {useCurrentFrame} from 'remotion';
import rule from '../config/captions.json';
import tmap from '../timing/timing_map.json';
import {FPS} from './config';

/** Burned-in captions: the lyrics as sung, by the same rule as scripts/export_srt.py (config/captions.json). */
type Cue = {a: number; b: number; text: string};
export const CUES: Cue[] = (() => {
  const lines = (tmap as any).sections.flatMap((s: any) => s.lines) as {start: number; end: number; text: string}[];
  return lines.map((l, i) => {
    const nxt = i + 1 < lines.length ? lines[i + 1].start : 1e9;
    return {a: l.start, b: Math.max(l.start + rule.min_s, Math.min(nxt, l.end + rule.tail_s)), text: l.text};
  });
})();

/** raised: frame ranges with a full-frame card up; the caption rises inside the card's border (inner line 60 px
 * from the bottom) instead of sitting on it. Elsewhere it sits 46 px up; overlays keep 150 px clear. */
export const Captions: React.FC<{offsetS?: number; size?: number; bottom?: number; width?: number; raised?: [number, number][]}> =
  ({offsetS = 0, size = 44, bottom, width = 1300, raised = []}) => {
    const f = useCurrentFrame();
    const t = f / FPS + offsetS;
    if (bottom === undefined && offsetS === 0) bottom = raised.some(([a, b]) => f >= a && f < b) ? 78 : 46;
    // in an excerpt (offsetS > 0) a cue must start inside it: no clipped tail of the line before the cut
    const cue = CUES.find((c) => t >= c.a && t < c.b && c.a >= offsetS);
    if (!cue) return null;
    return (
      <div style={{position: 'absolute', left: 0, right: 0, ...(bottom === undefined ? {top: 0} : {bottom}), display: 'flex', justifyContent: 'center'}}>
        <div style={{maxWidth: width, padding: '8px 22px', background: 'rgba(0,0,0,0.72)', color: '#f3efe6',
          fontFamily: 'Old Standard TT', fontSize: size, lineHeight: 1.25, textAlign: 'center'}}>{cue.text}</div>
      </div>
    );
  };
