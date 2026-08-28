import { useCallback, useEffect, useRef, useState } from "react";

type PressToTalkOptions = {
  enabled: boolean;
  onUtterance: (blob: Blob) => void | Promise<void>;
};

type TalkState = "off" | "idle" | "recording" | "unsupported";

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

/**
 * iOS-safe mic: open only while the user holds the button, then fully release
 * hardware before returning the blob (so TTS can play afterward).
 */
export const usePressToTalk = ({ enabled, onUtterance }: PressToTalkOptions) => {
  const [talkState, setTalkState] = useState<TalkState>("off");
  const [level, setLevel] = useState(0);
  const onUtteranceRef = useRef(onUtterance);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordingRef = useRef(false);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    onUtteranceRef.current = onUtterance;
  }, [onUtterance]);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled) {
      setTalkState("off");
      setLevel(0);
    } else {
      setTalkState("idle");
    }
  }, [enabled]);

  const hardStopHardware = useCallback(async () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    recorderRef.current = null;

    streamRef.current?.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // ignore
      }
    });
    streamRef.current = null;

    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    setLevel(0);
  }, []);

  const startTalking = useCallback(async () => {
    if (!enabledRef.current || recordingRef.current) return;
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setTalkState("unsupported");
      return;
    }

    recordingRef.current = true;
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      if (!recordingRef.current || !enabledRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const Ctor =
        window.AudioContext ||
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (Ctor) {
        const ctx = new Ctor();
        audioContextRef.current = ctx;
        if (ctx.state === "suspended") {
          await ctx.resume().catch(() => undefined);
        }
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          if (!recordingRef.current) return;
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i += 1) {
            const value = (data[i] - 128) / 128;
            sum += value * value;
          }
          setLevel(Math.sqrt(sum / data.length));
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorderRef.current = recorder;
      recorder.start(200);
      setTalkState("recording");
    } catch {
      recordingRef.current = false;
      await hardStopHardware();
      setTalkState("unsupported");
    }
  }, [hardStopHardware]);

  const stopTalking = useCallback(async () => {
    if (!recordingRef.current) return;
    recordingRef.current = false;

    const recorder = recorderRef.current;
    let blob: Blob | null = null;

    if (recorder && recorder.state !== "inactive") {
      blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const type = recorder.mimeType || pickMimeType() || "audio/mp4";
          resolve(new Blob(chunksRef.current, { type }));
        };
        try {
          recorder.stop();
        } catch {
          resolve(new Blob());
        }
      });
    }

    recorderRef.current = null;
    chunksRef.current = [];

    // Critical on iOS: release mic BEFORE returning to TTS pipeline.
    await hardStopHardware();
    // Let Safari flip audio session to playback.
    await new Promise<void>((resolve) => setTimeout(resolve, 180));

    setTalkState(enabledRef.current ? "idle" : "off");

    if (blob && blob.size > 1200 && enabledRef.current) {
      await onUtteranceRef.current(blob);
    }
  }, [hardStopHardware]);

  useEffect(() => {
    return () => {
      recordingRef.current = false;
      void hardStopHardware();
    };
  }, [hardStopHardware]);

  return {
    talkState,
    level,
    startTalking,
    stopTalking,
    isRecording: talkState === "recording",
  };
};
