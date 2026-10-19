type Tone = "ok" | "bad" | "done";

export const SOUND_KEY = "geoduolingo.sound";

const listeners = new Set<() => void>();

let audioContext: AudioContext | null = null;

export function soundEnabled() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SOUND_KEY) !== "off";
}

export function setSoundEnabled(on: boolean) {
  localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  for (const listener of listeners) listener();
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SOUND_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

export function unlockAudio() {
  try {
    const ctx = context();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  } catch {
    // A missing audio device should not block the lesson.
  }
}

function voice(
  ctx: AudioContext,
  frequency: number,
  at: number,
  duration: number,
  peak: number,
  type: OscillatorType,
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.02);
  return oscillator;
}

function slide(ctx: AudioContext, from: number, to: number, at: number, duration: number, peak: number) {
  const oscillator = voice(ctx, from, at, duration, peak, "sine");
  oscillator.frequency.exponentialRampToValueAtTime(to, at + duration * 0.85);
}

export function playTone(kind: Tone) {
  try {
    if (!soundEnabled()) return;
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    if (kind === "ok") {
      voice(ctx, 659.25, now, 0.14, 0.035, "triangle");
      voice(ctx, 880, now + 0.08, 0.18, 0.032, "sine");
      voice(ctx, 1318.5, now + 0.08, 0.12, 0.01, "sine");
      return;
    }
    if (kind === "bad") {
      slide(ctx, 392, 233.08, now, 0.18, 0.03);
      return;
    }
    voice(ctx, 523.25, now, 0.16, 0.03, "triangle");
    voice(ctx, 659.25, now + 0.12, 0.16, 0.03, "triangle");
    voice(ctx, 783.99, now + 0.24, 0.16, 0.03, "sine");
    voice(ctx, 1046.5, now + 0.36, 0.28, 0.034, "triangle");
    voice(ctx, 523.25, now + 0.36, 0.28, 0.012, "sine");
  } catch {
    // Sound is optional feedback. A blocked audio device should not break the lesson.
  }
}
