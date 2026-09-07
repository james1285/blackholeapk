/**
 * BlackHole Music Player - Interactive Web Audio Synthesizer & Canvas Visualizer
 */

class AudioDemoVisualizer {
  constructor() {
    this.canvas = document.getElementById('visualizerCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.playBtn = document.getElementById('demoPlayBtn');
    this.statusText = document.getElementById('demoStatusText');
    this.lyricsContainer = document.getElementById('demoSyncedLyrics');
    this.progressBar = document.getElementById('demoProgressBar');
    this.currentTimeEl = document.getElementById('demoCurrentTime');
    this.durationEl = document.getElementById('demoDuration');

    this.isPlaying = false;
    this.audioCtx = null;
    this.analyser = null;
    this.oscillator = null;
    this.gainNode = null;
    this.animationId = null;

    this.simulatedTime = 0;
    this.totalDuration = 184; // 3:04
    this.simulatedFrequencies = new Array(48).fill(10);

    this.lyrics = [
      { time: 0, text: "🎵 Streaming 320kbps Lossless Audio via BlackHole" },
      { time: 6, text: "Cosmic frequencies resonating across the horizon..." },
      { time: 14, text: "Seamless transition, pure ad-free experience" },
      { time: 22, text: "Equalizer tuned: 10-Band dynamic bass boost active" },
      { time: 30, text: "Importing Spotify & YouTube playlists in real-time..." },
      { time: 38, text: "Open-source freedom. GPL v3.0 by Ankit Sangwan." }
    ];

    this.initCanvasSize();
    this.bindEvents();
    this.renderIdleWave();
  }

  initCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      if (!this.isPlaying) this.renderIdleWave();
    });

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlayback());
    }
  }

  initAudioContext() {
    if (this.audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("Web Audio not supported or blocked, fallback to simulated waveform.", e);
    }
  }

  startSynthesizer() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Gentle ambient harmonic chord synth
    const freqs = [220, 277.18, 329.63, 440]; // A major chord
    this.oscillators = freqs.map((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      const subGain = this.audioCtx.createGain();
      subGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      osc.connect(subGain);
      subGain.connect(this.gainNode);
      osc.start();
      return osc;
    });
  }

  stopSynthesizer() {
    if (this.oscillators) {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = null;
    }
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    this.initAudioContext();
    this.startSynthesizer();

    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Pause Demo');
    }

    if (this.statusText) {
      this.statusText.textContent = "Streaming Live: BlackHole Ambient Demo (320kbps AAC)";
    }

    this.animateLoop();
  }

  pause() {
    this.isPlaying = false;
    this.stopSynthesizer();

    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6,4 20,12 6,20"></polygon>
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Play Demo');
    }

    if (this.statusText) {
      this.statusText.textContent = "Click Play to Experience 320kbps Audio Preview";
    }

    cancelAnimationFrame(this.animationId);
    this.renderIdleWave();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  updateLyrics(curr) {
    if (!this.lyricsContainer) return;
    let activeLyric = this.lyrics[0].text;
    for (let i = 0; i < this.lyrics.length; i++) {
      if (curr >= this.lyrics[i].time) {
        activeLyric = this.lyrics[i].text;
      }
    }
    this.lyricsContainer.innerHTML = `<span class="active-lyric">“${activeLyric}”</span>`;
  }

  animateLoop() {
    if (!this.isPlaying) return;

    this.simulatedTime += 0.05;
    if (this.simulatedTime > this.totalDuration) this.simulatedTime = 0;

    if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(this.simulatedTime);
    if (this.durationEl) this.durationEl.textContent = this.formatTime(this.totalDuration);
    if (this.progressBar) {
      const pct = (this.simulatedTime / this.totalDuration) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    this.updateLyrics(this.simulatedTime);

    // Draw visualizer
    this.ctx.clearRect(0, 0, this.width, this.height);

    const barCount = 42;
    const barWidth = (this.width / barCount) - 3;
    const time = Date.now() * 0.003;

    // Create neon gradient
    const grad = this.ctx.createLinearGradient(0, this.height, 0, 0);
    grad.addColorStop(0, '#00f2fe');
    grad.addColorStop(0.5, '#8a2be2');
    grad.addColorStop(1, '#ff007f');

    for (let i = 0; i < barCount; i++) {
      // Dynamic generative wave calculation
      const wave1 = Math.sin(i * 0.25 + time) * 20;
      const wave2 = Math.cos(i * 0.15 - time * 1.5) * 15;
      const wave3 = Math.sin(time * 3 + i) * 10;
      const h = Math.max(6, Math.min(this.height * 0.85, 30 + wave1 + wave2 + wave3));

      const x = i * (barWidth + 3);
      const y = this.height - h;

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(x, y, barWidth, h, [4, 4, 0, 0]);
      } else {
        this.ctx.rect(x, y, barWidth, h);
      }
      this.ctx.fill();

      // Top glow cap
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(x, y, barWidth, 2);
    }

    this.animationId = requestAnimationFrame(() => this.animateLoop());
  }

  renderIdleWave() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const barCount = 42;
    const barWidth = (this.width / barCount) - 3;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

    for (let i = 0; i < barCount; i++) {
      const h = 8 + Math.sin(i * 0.2) * 6;
      const x = i * (barWidth + 3);
      const y = this.height - h;

      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(x, y, barWidth, h, [3, 3, 0, 0]);
      } else {
        this.ctx.rect(x, y, barWidth, h);
      }
      this.ctx.fill();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.audioDemo = new AudioDemoVisualizer();
});
