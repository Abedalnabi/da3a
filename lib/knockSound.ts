"use client";

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

/** Creates and resumes the AudioContext ahead of time so the first real knock
 *  isn't the thing that has to cold-start it — call from a user gesture. */
export function warmUpKnockAudio() {
  getContext();
}

/** Synthesizes a short percussive door-knock "thud" — no external audio file needed. */
export function playKnockSound() {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // low thud body
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.13);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.55, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(oscGain).connect(ctx.destination);

  // short filtered noise burst for the knuckle "knock" attack
  const bufferSize = Math.floor(ctx.sampleRate * 0.06);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 900;
  noiseFilter.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.45, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
  noise.start(now);
  noise.stop(now + 0.07);
}
