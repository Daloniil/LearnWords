import { useCallback, useEffect, useRef, useState } from "react";

type AutoListenOptions = {
  enabled: boolean;
  onUtterance: (blob: Blob) => void | Promise<void>;
  silenceMs?: number;
  threshold?: number;
  minSpeechMs?: number;
};

type ListenState = "off" | "idle" | "speech" | "unsupported";

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return "";
};

export const useAutoVoiceListen = ({
  enabled,
  onUtterance,
  silenceMs = 1100,
  threshold = 0.02,
  minSpeechMs = 350,
}: AutoListenOptions) => {
  const [listenState, setListenState] = useState<ListenState>("off");
  const [level, setLevel] = useState(0);
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
  const levelTickRef = useRef(0);

  useEffect(() => {
    onUtteranceRef.current = onUtterance;
  }, [onUtterance]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const stopRecorder = useCallback(async (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      recorderRef.current = null;
      return null;
    }

    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        resolve(new Blob(chunksRef.current, { type }));
      };
      recorder.stop();
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
    if (!stream || recorderRef.current) return;

    const mimeType = pickMimeType();
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorderRef.current = recorder;
    recorder.start(200);
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
      if (blob && blob.size > 1200 && enabledRef.current) {
        await onUtteranceRef.current(blob);
      }
    } finally {
      processingRef.current = false;
      if (enabledRef.current) {
        setListenState("idle");
      }
    }
  }, [stopRecorder]);

  useEffect(() => {
    if (!enabled) {
      cleanup();
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
          },
        });
        if (cancelled || !enabledRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
        setListenState("idle");

        const data = new Uint8Array(analyser.fftSize);

        const tick = () => {
          if (cancelled || !enabledRef.current || processingRef.current) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          const currentAnalyser = analyserRef.current;
          if (!currentAnalyser) return;

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

    setup();

    return () => {
      cancelled = true;
      void cleanup();
    };
  }, [
    enabled,
    cleanup,
    finishUtterance,
    minSpeechMs,
    silenceMs,
    startSpeechCapture,
    threshold,
  ]);

  return {
    listenState,
    level,
    stopListening: cleanup,
  };
};
