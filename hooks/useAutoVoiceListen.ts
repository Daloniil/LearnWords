import { useCallback, useEffect, useRef, useState } from "react";

type AutoListenOptions = {
  enabled: boolean;
  /** Keep mic open but do not record (e.g. while tutor TTS is playing). */
  paused?: boolean;
  onUtterance: (blob: Blob) => void | Promise<void>;
  silenceMs?: number;
  threshold?: number;
  minSpeechMs?: number;
};

type ListenState = "off" | "idle" | "speech" | "unsupported";

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  // iOS Safari prefers mp4/aac; Chromium prefers webm.
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

export const useAutoVoiceListen = ({
  enabled,
  paused = false,
  onUtterance,
  silenceMs = 1100,
  threshold = 0.02,
  minSpeechMs = 350,
}: AutoListenOptions) => {
  const [listenState, setListenState] = useState<ListenState>("off");
  const [level, setLevel] = useState(0);
  const [restartToken, setRestartToken] = useState(0);
  const onUtteranceRef = useRef(onUtterance);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechStartedAtRef = useRef<number | null>(null);
  const lastLoudAtRef = useRef<number>(0);
  const processingRef = useRef(false);
  const enabledRef = useRef(enabled);
  const pausedRef = useRef(paused);
  const levelTickRef = useRef(0);

  useEffect(() => {
    onUtteranceRef.current = onUtterance;
  }, [onUtterance]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const setMicTracksEnabled = useCallback((value: boolean) => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = value;
    });
  }, []);

  const resumeAudioContext = useCallback(async () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // iOS may require a fresh user gesture
      }
    }
  }, []);

  const stopRecorder = useCallback(async (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      recorderRef.current = null;
      return null;
    }

    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || pickMimeType() || "audio/webm";
        resolve(new Blob(chunksRef.current, { type }));
      };
      try {
        recorder.stop();
      } catch {
        resolve(new Blob());
      }
    });

    recorderRef.current = null;
    chunksRef.current = [];
    return blob;
  }, []);

  const cleanup = useCallback(async () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    recorderRef.current = null;
    chunksRef.current = [];
    speechStartedAtRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setListenState("off");
    setLevel(0);
  }, []);

  const startSpeechCapture = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || recorderRef.current || pausedRef.current) return;

    const mimeType = pickMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      try {
        recorder = new MediaRecorder(stream);
      } catch {
        return;
      }
    }

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onerror = () => {
      recorderRef.current = null;
      speechStartedAtRef.current = null;
      setListenState("idle");
    };
    recorderRef.current = recorder;
    try {
      recorder.start(250);
    } catch {
      recorderRef.current = null;
      return;
    }
    speechStartedAtRef.current = Date.now();
    setListenState("speech");
  }, []);

  const finishUtterance = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setListenState("idle");

    try {
      const blob = await stopRecorder();
      speechStartedAtRef.current = null;
      if (blob && blob.size > 1200 && enabledRef.current && !pausedRef.current) {
        await onUtteranceRef.current(blob);
      }
    } finally {
      processingRef.current = false;
      if (enabledRef.current) {
        setListenState("idle");
      }
    }
  }, [stopRecorder]);

  // Pause: stop in-flight capture, mute tracks so iOS can play TTS cleanly.
  useEffect(() => {
    if (!enabled) return;

    if (paused) {
      void (async () => {
        if (recorderRef.current) {
          await stopRecorder();
          speechStartedAtRef.current = null;
        }
        setMicTracksEnabled(false);
        setListenState("idle");
        setLevel(0);
      })();
      return;
    }

    setMicTracksEnabled(true);
    void resumeAudioContext();
    setListenState("idle");
  }, [enabled, paused, resumeAudioContext, setMicTracksEnabled, stopRecorder]);

  // Resume AudioContext after TTS / tab focus (critical on iOS Safari).
  useEffect(() => {
    if (!enabled) return;

    const kick = () => {
      if (!pausedRef.current) {
        void resumeAudioContext();
        setMicTracksEnabled(true);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") kick();
    };

    window.addEventListener("focus", kick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", kick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, resumeAudioContext, setMicTracksEnabled]);

  useEffect(() => {
    if (!enabled) {
      void cleanup();
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        if (
          typeof window === "undefined" ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          setListenState("unsupported");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (cancelled || !enabledRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream.getAudioTracks().forEach((track) => {
          track.onended = () => {
            if (!enabledRef.current || cancelled) return;
            // iOS often kills the track after playback session changes.
            setRestartToken((value) => value + 1);
          };
        });

        streamRef.current = stream;
        if (pausedRef.current) {
          setMicTracksEnabled(false);
        }

        const Ctor = getAudioContextCtor();
        if (!Ctor) {
          setListenState("unsupported");
          return;
        }

        const audioContext = new Ctor();
        audioContextRef.current = audioContext;
        if (audioContext.state === "suspended") {
          await audioContext.resume().catch(() => undefined);
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
        setListenState("idle");

        const data = new Uint8Array(analyser.fftSize);

        const tick = () => {
          if (cancelled || !enabledRef.current) {
            return;
          }

          if (processingRef.current || pausedRef.current) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          const currentAnalyser = analyserRef.current;
          const ctx = audioContextRef.current;
          if (!currentAnalyser) return;

          if (ctx && ctx.state === "suspended") {
            void ctx.resume().catch(() => undefined);
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          currentAnalyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i += 1) {
            const value = (data[i] - 128) / 128;
            sum += value * value;
          }
          const rms = Math.sqrt(sum / data.length);
          const now = Date.now();
          levelTickRef.current += 1;
          if (levelTickRef.current % 3 === 0) {
            setLevel(rms);
          }

          if (rms >= threshold) {
            lastLoudAtRef.current = now;
            if (!recorderRef.current) {
              startSpeechCapture();
            }
          } else if (recorderRef.current && speechStartedAtRef.current) {
            const spokenFor = now - speechStartedAtRef.current;
            const silentFor = now - lastLoudAtRef.current;
            if (spokenFor >= minSpeechMs && silentFor >= silenceMs) {
              void finishUtterance();
            }
          }

          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setListenState("unsupported");
      }
    };

    void setup();

    return () => {
      cancelled = true;
      void cleanup();
    };
  }, [
    enabled,
    restartToken,
    cleanup,
    finishUtterance,
    minSpeechMs,
    setMicTracksEnabled,
    silenceMs,
    startSpeechCapture,
    threshold,
  ]);

  return {
    listenState,
    level,
    stopListening: cleanup,
    resumeAudioContext,
  };
};
