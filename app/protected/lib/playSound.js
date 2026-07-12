"use client";

// Sonidos generados con Web Audio API (sin archivos de audio externos que
// mantener/descargar). Son tonos cortos y suaves, pensados para acompañar
// los modales de resultado (éxito/error) sin ser intrusivos.
let audioContext;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

function beep({ frequency, startTime = 0, duration = 0.15, type = "sine", volume = 0.15 }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const when = ctx.currentTime + startTime;
  oscillator.start(when);
  // Rampa exponencial a (casi) silencio en vez de cortar seco, para que no
  // truene al terminar.
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.stop(when + duration);
}

// Dos notas ascendentes cortas: se siente como una confirmación positiva.
export function playSuccessSound() {
  try {
    beep({ frequency: 880, duration: 0.12 });
    beep({ frequency: 1174, startTime: 0.1, duration: 0.15 });
  } catch (error) {
    console.error("No se pudo reproducir el sonido de éxito", error);
  }
}

// Un solo tono grave: se siente como una alerta, sin ser agresivo.
export function playErrorSound() {
  try {
    beep({ frequency: 220, duration: 0.25, type: "square", volume: 0.08 });
  } catch (error) {
    console.error("No se pudo reproducir el sonido de error", error);
  }
}
