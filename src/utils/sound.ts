// Synthesized Web Audio API game sound effects (zero external audio dependencies)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
  delay = 0
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playSoundEffect(
  effect: 'click' | 'correct' | 'wrong' | 'complete' | 'unlock',
  enabled: boolean
) {
  if (!enabled) return;
  try {
    if (effect === 'click') {
      playTone(540, 0.06, 'triangle', 0.05);
    } else if (effect === 'correct') {
      playTone(523.25, 0.12, 'triangle', 0.08, 0);
      playTone(659.25, 0.12, 'triangle', 0.08, 0.08);
      playTone(783.99, 0.18, 'triangle', 0.09, 0.16);
    } else if (effect === 'wrong') {
      playTone(240, 0.16, 'sawtooth', 0.05, 0);
      playTone(190, 0.22, 'sawtooth', 0.05, 0.12);
    } else if (effect === 'complete') {
      playTone(523.25, 0.12, 'triangle', 0.08, 0);
      playTone(659.25, 0.12, 'triangle', 0.08, 0.1);
      playTone(783.99, 0.12, 'triangle', 0.08, 0.2);
      playTone(1046.5, 0.32, 'triangle', 0.1, 0.3);
    } else if (effect === 'unlock') {
      playTone(587.33, 0.1, 'sine', 0.08, 0);
      playTone(739.99, 0.1, 'sine', 0.08, 0.09);
      playTone(880, 0.12, 'sine', 0.09, 0.18);
      playTone(1174.66, 0.3, 'triangle', 0.1, 0.28);
    }
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}
