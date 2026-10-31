/** Deterministic randomness: every effect derives its numbers from (seed, stream, index). */
export const hash = (seed: number, stream: number, i: number): number => {
  let t = (seed * 0x9e3779b1) ^ (stream * 0x85ebca77) ^ (i * 0xc2b2ae3d);
  t = Math.imul(t ^ (t >>> 16), 0x7feb352d);
  t = Math.imul(t ^ (t >>> 15), 0x846ca68b);
  t ^= t >>> 16;
  return (t >>> 0) / 4294967296;
};

/** Smoothed value noise in [-1, 1]: random keys every `period` steps, cosine-interpolated. */
export const smooth = (seed: number, stream: number, x: number, period: number): number => {
  const k = Math.floor(x / period);
  const f = x / period - k;
  const a = hash(seed, stream, k) * 2 - 1;
  const b = hash(seed, stream, k + 1) * 2 - 1;
  const w = (1 - Math.cos(f * Math.PI)) / 2;
  return a * (1 - w) + b * w;
};
