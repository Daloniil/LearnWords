/**
 * Single shared voice session for natural turn-taking dialogue.
 * Critical for iOS: one AudioContext + one mic stream for the whole chat.
 * Never stop mic tracks between turns; duck listening while TTS plays.
 */

type LevelListener = (level: number) => void;
type UtteranceHandler = (blob: Blob) => void | Promise<void>;

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  if (MediaRecorder.isTypeSupported("audio/aac")) return "audio/aac";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  return "";
};

const getAudioContextCtor = () => {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (
      window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext ||
    null
  );
};

class VoiceSession {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private raf: number | null = null;
  private listening = false;
  private speaking = false;
  private speechStartedAt: number | null = null;
  private lastLoudAt = 0;
  private processing = false;
  private onUtterance: UtteranceHandler | null = null;
  private onLevel: LevelListener | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private silenceMs = 1100;
  private threshold = 0.018;
  private minSpeechMs = 350;

  get isReady() {
    return Boolean(this.ctx && this.stream);
  }

  get isSpeaking() {
    return this.speaking;
  }

  /** Must be called from a user gesture (Start). */
  async start() {
    if (this.isReady) {
      await this.ctx?.resume().catch(() => undefined);
      return;
    }

    const Ctor = getAudioContextCtor();
    if (!Ctor) {
      throw new Error("AudioContext unavailable");
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone unavailable");
    }

    this.ctx = new Ctor();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    // Warm destination with a silent buffer (keeps iOS session in mixed mode).
    const buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
    const warm = this.ctx.createBufferSource();
    warm.buffer = buffer;
    warm.connect(this.ctx.destination);
    warm.start(0);

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.source.connect(this.analyser);
  }

  setUtteranceHandler(handler: UtteranceHandler | null) {
    this.onUtterance = handler;
  }

  setLevelListener(listener: LevelListener | null) {
    this.onLevel = listener;
  }

  beginListening() {
    if (!this.isReady || this.listening) return;
    this.listening = true;
    this.speechStartedAt = null;
    this.tick();
  }

  pauseListening() {
    this.listening = false;
    if (this.recorder && this.recorder.state !== "inactive") {
      try {
        this.recorder.stop();
      } catch {
        // ignore
      }
    }
    this.recorder = null;
    this.chunks = [];
    this.speechStartedAt = null;
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.onLevel?.(0);
  }

  stopSpeaking() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // ignore
      }
      this.currentSource = null;
    }
    this.speaking = false;
  }

  /** Play WAV/PCM through the SAME AudioContext (iOS-safe after mic grant). */
  async playBlob(blob: Blob) {
    if (!this.ctx) {
      throw new Error("Voice session not started");
    }

    this.pauseListening();
    this.stopSpeaking();
    this.speaking = true;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
      let settled = false;
      const ok = (value: AudioBuffer) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      const fail = (error?: DOMException | string) => {
        if (settled) return;
        settled = true;
        reject(error || new Error("decode failed"));
      };
      try {
        const maybe = this.ctx!.decodeAudioData(
          arrayBuffer.slice(0),
          ok,
          fail
        ) as Promise<AudioBuffer> | void;
        if (maybe && typeof maybe.then === "function") {
          maybe.then(ok, fail);
        }
      } catch (error) {
        fail(error as DOMException);
      }
    });

    await new Promise<void>((resolve, reject) => {
      const source = this.ctx!.createBufferSource();
      this.currentSource = source;
      source.buffer = audioBuffer;
      source.connect(this.ctx!.destination);
      source.onended = () => {
        if (this.currentSource === source) this.currentSource = null;
        this.speaking = false;
        resolve();
      };
      try {
        source.start(0);
      } catch (error) {
        this.speaking = false;
        reject(error);
      }
      // Safety timeout
      setTimeout(() => {
        if (this.currentSource === source) {
          try {
            source.stop();
          } catch {
            // ignore
          }
          this.currentSource = null;
          this.speaking = false;
          resolve();
        }
      }, Math.ceil(audioBuffer.duration * 1000) + 800);
    });
  }

  async end() {
    this.pauseListening();
    this.stopSpeaking();
    this.onUtterance = null;
    this.onLevel = null;

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.source = null;
    this.analyser = null;

    if (this.ctx) {
      try {
        await this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }

  private startRecorder() {
    if (!this.stream || this.recorder || this.speaking || this.processing) return;
    const mimeType = pickMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(this.stream, { mimeType })
        : new MediaRecorder(this.stream);
    } catch {
      try {
        recorder = new MediaRecorder(this.stream);
      } catch {
        return;
      }
    }

    this.chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };
    this.recorder = recorder;
    try {
      recorder.start(200);
      this.speechStartedAt = Date.now();
    } catch {
      this.recorder = null;
    }
  }

  private async finishUtterance() {
    if (this.processing) return;
    this.processing = true;
    const recorder = this.recorder;
    this.recorder = null;
    this.speechStartedAt = null;

    let blob: Blob | null = null;
    if (recorder && recorder.state !== "inactive") {
      blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const type = recorder.mimeType || pickMimeType() || "audio/mp4";
          resolve(new Blob(this.chunks, { type }));
        };
        try {
          recorder.stop();
        } catch {
          resolve(new Blob());
        }
      });
    }
    this.chunks = [];

    try {
      if (blob && blob.size > 1200 && this.onUtterance && this.listening) {
        // Pause VAD while the dialogue pipeline runs (STT → LLM → TTS).
        this.pauseListening();
        await this.onUtterance(blob);
      }
    } finally {
      this.processing = false;
    }
  }

  private tick = () => {
    if (!this.listening || !this.analyser || this.speaking || this.processing) {
      if (this.listening && !this.speaking && !this.processing) {
        this.raf = requestAnimationFrame(this.tick);
      }
      return;
    }

    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => undefined);
    }

    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i += 1) {
      const value = (data[i] - 128) / 128;
      sum += value * value;
    }
    const rms = Math.sqrt(sum / data.length);
    this.onLevel?.(rms);

    const now = Date.now();
    if (rms >= this.threshold) {
      this.lastLoudAt = now;
      if (!this.recorder) this.startRecorder();
    } else if (this.recorder && this.speechStartedAt) {
      const spokenFor = now - this.speechStartedAt;
      const silentFor = now - this.lastLoudAt;
      if (spokenFor >= this.minSpeechMs && silentFor >= this.silenceMs) {
        void this.finishUtterance();
      }
    }

    this.raf = requestAnimationFrame(this.tick);
  };
}

export const voiceSession = new VoiceSession();
