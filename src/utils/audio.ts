/**
 * Classroom Audio Engine
 * Uses Web Audio API for zero-latency, reliable sound effects and cheerful procedural BGM.
 * Uses Web Speech API for authentic English word pronunciation.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmIntervalId: number | null = null;
  private isMuted = false;
  private bgmVolume = 0.35;
  private sfxVolume = 0.6;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx) {
      if (this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime);
      }
      if (this.sfxGain) {
        this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
      }
    }
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = val;
    if (this.ctx && this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // Play crisp cheerful reward sound (+5)
  public playRewardSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Cheerful 3-note glockenspiel arpeggio (G5, C6, E6)
    const notes = [783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const noteGain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      noteGain.gain.setValueAtTime(0, now + idx * 0.07);
      noteGain.gain.linearRampToValueAtTime(0.3, now + idx * 0.07 + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(noteGain);
      noteGain.connect(this.sfxGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });

    // Add extra soft chime shimmer
    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(1567.98, now + 0.15); // G6
    chimeGain.gain.setValueAtTime(0.15, now + 0.15);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    chime.connect(chimeGain);
    chimeGain.connect(this.sfxGain);
    chime.start(now + 0.15);
    chime.stop(now + 0.5);
  }

  // Play gentle, funny boing/wobble error sound (-1)
  public playErrorSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Funny cartoon wobble slide down (260Hz down to 110Hz with vibrato)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);

    // Low pass filter to make it gentle and warm
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Play combo fanfare sound
  public playComboSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C major fanfare
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + 0.7);
    });
  }

  // Cheerful, uplifting background music built purely with procedural Web Audio synthesis
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Upbeat pentatonic / major cheerful loop (C major / A minor upbeat bounce)
    // Notes in Hz: C4, D4, E4, G4, A4, C5, D5, E5
    const scale: { [key: string]: number } = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      G5: 783.99,
      rest: 0,
    };

    // 16-step lively upbeat melody
    const melody = [
      'C5', 'E5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4',
      'C5', 'D5', 'E5', 'C5', 'G4', 'A4', 'C5', 'rest',
      'E5', 'G5', 'A4', 'C5', 'D5', 'E5', 'D5', 'C5',
      'G4', 'C5', 'D5', 'E5', 'C5', 'G4', 'C5', 'rest'
    ];

    // Bassline accompaniment
    const bass = [
      'C4', 'G4', 'C4', 'G4', 'A4', 'E4', 'A4', 'E4',
      'F4', 'C4', 'F4', 'C4', 'G4', 'D4', 'G4', 'D4',
      'C4', 'G4', 'C4', 'G4', 'A4', 'E4', 'A4', 'E4',
      'F4', 'C4', 'F4', 'C4', 'G4', 'B4', 'C4', 'rest'
    ];

    let step = 0;
    const stepDurationMs = 220; // brisk and playful tempo (~136 BPM)

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.bgmGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const noteName = melody[step % melody.length];
      const bassNoteName = bass[step % bass.length];

      // Play melody note (marimba/music box style)
      if (noteName !== 'rest') {
        const freq = scale[noteName];
        if (freq) {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          // Plucky marimba envelope
          noteGain.gain.setValueAtTime(0.18, now);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc.connect(noteGain);
          noteGain.connect(this.bgmGain);

          osc.start(now);
          osc.stop(now + 0.3);
        }
      }

      // Play soft warm bass note
      if (bassNoteName !== 'rest' && step % 2 === 0) {
        const bFreq = (scale[bassNoteName] || 261.63) / 2;
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();

        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, now);

        bGain.gain.setValueAtTime(0.12, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bOsc.connect(bGain);
        bGain.connect(this.bgmGain);

        bOsc.start(now);
        bOsc.stop(now + 0.38);
      }

      step++;
    }, stepDurationMs);
  }

  public stopBGM() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public isBGMActive(): boolean {
    return this.isBgmPlaying;
  }

  // Pronounce English words using Web Speech API
  public speakWord(word: 'lantern' | 'glutinous rice') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.88; // slightly slower for clear elementary classroom listening
      utterance.pitch = 1.1; // warm, encouraging tone
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback silently
    }
  }
}

export const soundEngine = new SoundEngine();
