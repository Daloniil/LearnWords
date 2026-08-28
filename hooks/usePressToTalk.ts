import { useCallback, useEffect, useRef, useState } from "react";
import { reclaimPlaybackSession } from "../utils/speakRussian";

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
 * iOS-safe mic: open only while held. No AudioContext (it poisons playback).
 * On release, reclaim playback session inside the user gesture, then hand off blob.
 */
export const usePressToTalk = ({ enabled, onUtterance }: PressToTalkOptions) => {
  const [talkState, setTalkState] = useState<TalkState>("off");
  const [level, setLevel] = useState(0);
  const onUtteranceRef = useRef(onUtterance);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);
  const enabledRef = useRef(enabled);
  const levelTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const hardStopHardware = useCallback(() => {
    if (levelTimerRef.current) {
      clearInterval(levelTimerRef.current);
      levelTimerRef.current = null;
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

      // Fake level pulse — do NOT open AudioContext on iOS (breaks TTS).
      levelTimerRef.current = setInterval(() => {
        setLevel(0.15 + Math.random() * 0.35);
      }, 120);

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
      hardStopHardware();
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

    // Stop mic tracks first…
    hardStopHardware();
    // …then reclaim playback INSIDE this gesture stack as much as possible.
    reclaimPlaybackSession();

    await new Promise<void>((resolve) => setTimeout(resolve, 250));
    reclaimPlaybackSession();

    setTalkState(enabledRef.current ? "idle" : "off");

    if (blob && blob.size > 1200 && enabledRef.current) {
      await onUtteranceRef.current(blob);
    }
  }, [hardStopHardware]);

  useEffect(() => {
    return () => {
      recordingRef.current = false;
      hardStopHardware();
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
