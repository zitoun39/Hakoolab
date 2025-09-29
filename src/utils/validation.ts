export function toNum(v: string | number, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function mustPositive(n: number, name = 'value') {
  if (!(n > 0)) throw new Error(`${name} يجب أن يكون > 0`);
  return n;
}
