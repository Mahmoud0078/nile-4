export type NotifyKind = "accepted" | "arrived" | "message";

type Tone = {
  freq: number;
  start: number;
  duration: number;
  gain: number;
};

const PATTERNS: Record<NotifyKind, { tones: Tone[]; vibrate: number[] }> = {
  accepted: {
    tones: [
      { freq: 587.33, start: 0, duration: 0.14, gain: 0.22 },
      { freq: 880, start: 0.14, duration: 0.22, gain: 0.24 },
    ],
    vibrate: [0, 90, 70, 140],
  },
  arrived: {
    tones: [
      { freq: 659.25, start: 0, duration: 0.16, gain: 0.24 },
      { freq: 783.99, start: 0.16, duration: 0.16, gain: 0.24 },
      { freq: 1046.5, start: 0.32, duration: 0.34, gain: 0.26 },
    ],
    vibrate: [0, 140, 90, 140, 90, 260],
  },
  message: {
    tones: [{ freq: 740, start: 0, duration: 0.12, gain: 0.18 }],
    vibrate: [0, 45],
  },
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

/** Must be called from a user gesture to unlock audio on mobile browsers. */
export function unlockAudio(): void {
  const audio = getContext();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
}

export function playChime(kind: NotifyKind, intensity = 1): void {
  const audio = getContext();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();

  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.value = Math.min(1.4, 0.9 * intensity);
  master.connect(audio.destination);

  for (const tone of PATTERNS[kind].tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = tone.freq;

    const t0 = now + tone.start;
    const t1 = t0 + tone.duration;

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(
      Math.min(0.5, tone.gain * intensity),
      t0 + 0.02,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, t1);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}

export function vibrate(kind: NotifyKind, intensity = 1): boolean {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return false;
  }
  try {
    const base = PATTERNS[kind].vibrate;
    const pattern =
      intensity <= 1
        ? base
        : [...base, ...base.slice(1).map((v) => Math.round(v * intensity))];
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

/** Fires sound + vibration together. Returns whether vibration was supported. */
export function notify(kind: NotifyKind, intensity = 1): boolean {
  playChime(kind, intensity);
  return vibrate(kind, intensity);
}

export function supportsVibration(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}