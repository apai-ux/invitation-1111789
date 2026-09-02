/**
 * Gentle, peaceful ambient audio synthesizer using Web Audio API
 * Generates soft meditative oriental acoustic chimes and warm drone chords
 */
class AudioAmbiance {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isPlaying = true;

      // Pentatonic warm frequencies for peaceful oriental / royal wedding ambiance
      // D minor / Hijaz / Bayati warm scale
      const notes = [146.83, 220.0, 261.63, 293.66, 329.63, 349.23, 440.0, 523.25];

      const playChime = () => {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Random note from scale
        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.6);
      };

      playChime();
      this.intervalId = setInterval(playChime, 3200);
    } catch (e) {
      console.warn('AudioContext not allowed without user interaction:', e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioAmbiance = new AudioAmbiance();
