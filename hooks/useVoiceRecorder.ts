import { useCallback, useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "unsupported";

export const useVoiceRecorder = () => {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  const startRecording = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setRecorderState("unsupported");
      throw new Error("Microphone is not supported in this browser");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "";

    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecorderState("recording");
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      throw new Error("Recorder is not active");
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      recorder.onerror = () => reject(new Error("Recording failed"));
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        resolve(new Blob(chunksRef.current, { type }));
      };
      recorder.stop();
    });

    cleanupStream();
    mediaRecorderRef.current = null;
    setRecorderState("idle");
    return blob;
  }, [cleanupStream]);

  return {
    recorderState,
    startRecording,
    stopRecording,
  };
};
