/**
 * Sound Effects Utility
 *
 * Uses Web Audio API to generate simple feedback sounds
 * for drill answers without requiring external audio files.
 */

type SoundType = 'correct' | 'partial' | 'incorrect';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Plays a feedback sound based on answer quality.
 * - correct: Pleasant ascending chime
 * - partial: Neutral mid-tone
 * - incorrect: Low descending tone
 */
export function playSound(type: SoundType): void {
  try {
    const ctx = getAudioContext();

    // Resume audio context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'correct':
        // Pleasant ascending chime (C5 -> E5 -> G5)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, now); // C5
        oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case 'partial':
        // Neutral single tone (A4)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now); // A4
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'incorrect':
        // Low descending tone (E4 -> C4)
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(330, now); // E4
        oscillator.frequency.linearRampToValueAtTime(262, now + 0.3); // C4
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        break;
    }
  } catch {
    // Silently fail if audio is not supported
    console.warn('Audio playback not supported');
  }
}

/**
 * Plays the appropriate sound for an answer quality.
 */
export function playAnswerSound(quality: 'best' | 'ok' | 'bad' | 'timeout'): void {
  switch (quality) {
    case 'best':
      playSound('correct');
      break;
    case 'ok':
      playSound('partial');
      break;
    case 'bad':
    case 'timeout':
      playSound('incorrect');
      break;
  }
}
