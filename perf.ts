/** Coalesce rapid calls into one per animation frame. */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let queued = false;
  let lastArgs: unknown[] = [];

  return ((...args: unknown[]) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      (fn as (...a: unknown[]) => void)(...lastArgs);
    });
  }) as unknown as T;
}

/** Trailing-edge throttle for high-frequency events (scroll, GPS). */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  waitMs: number,
): T {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] = [];

  return ((...args: unknown[]) => {
    lastArgs = args;
    const now = Date.now();
    const remaining = waitMs - (now - last);

    if (remaining <= 0) {
      last = now;
      (fn as (...a: unknown[]) => void)(...lastArgs);
      return;
    }
    if (timer) return;
    timer = setTimeout(() => {
      last = Date.now();
      timer = null;
      (fn as (...a: unknown[]) => void)(...lastArgs);
    }, remaining);
  }) as unknown as T;
}

/** Bounded LRU-ish cache to keep memory flat under heavy load. */
export class BoundedCache<K, V> {
  private map = new Map<K, V>();

  constructor(private readonly max = 500) {}

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value === undefined) return undefined;
    // refresh recency
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.max) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }

  get size(): number {
    return this.map.size;
  }
}

/** Stable key for a coordinate rounded to ~11m precision. */
export function geoKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)}:${lng.toFixed(4)}`;
}