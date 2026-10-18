type Tone = "ok" | "bad" | "done";

let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

function beep(ctx: AudioContext, frequency: number, at: number, duration: number) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.06, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.02);
}

export function playTone(kind: Tone) {
  try {
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    if (kind === "ok") {
      beep(ctx, 660, now, 0.12);
      beep(ctx, 880, now + 0.09, 0.14);
      return;
    }
    if (kind === "bad") {
      beep(ctx, 196, now, 0.2);
      return;
    }
    beep(ctx, 523, now, 0.12);
    beep(ctx, 659, now + 0.1, 0.12);
    beep(ctx, 784, now + 0.2, 0.18);
  } catch {
    // Sound is optional feedback. A blocked audio device should not break the lesson.
  }
}
