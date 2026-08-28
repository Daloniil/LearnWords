import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState } from "../../components/EmptyState";
import { MicRipple } from "../../components/MicRipple";
import { PageHeader } from "../../components/PageHeader";
import { VoiceOrb } from "../../components/VoiceOrb";
import { useAuth } from "../../hooks/useAuth";
import { useAutoVoiceListen } from "../../hooks/useAutoVoiceListen";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { useLogin } from "../../hooks/useLogin";
import { useNotification } from "../../hooks/useNotification";
import { useWords } from "../../hooks/useWords";
import { LoginStatus, NotificationKeys } from "../../services/localKey";
import { ChatMessage, chatWithLocalLlm } from "../../services/llmService";
import { AI_CONFIG, aiFetch } from "../../services/aiConfig";
import {
  buildMixedSpeechPrompt,
  transcribeAudio,
} from "../../services/whisperService";
import { pageStack, surfaceCard } from "../../Styles/shared";
import { dialogueTranslation } from "../../translation/Dialogue";
import {
  buildContinueUserPrompt,
  buildDialogueSystemPrompt,
  buildFirstQuestionUserPrompt,
  buildWelcomeText,
  pickPracticeWords,
} from "../../utils/dialoguePrompt";
import { setTranslation } from "../../utils/setTranslation";
import {
  speakRussian,
  stopSpeaking,
  unlockAudioSession,
  warmUpSpeechVoices,
} from "../../utils/speakRussian";

type DialogueTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Phase =
  | "idle"
  | "starting"
  | "ready"
  | "transcribing"
  | "thinking"
  | "speaking";

const DialoguePage = () => {
  const { checkingLogin } = useLogin();
  const { authContext } = useAuth();
  const { languageContext } = useLanguage();
  const { learningPair, pairConfig } = useLearningPair();
  const { wordsHook, getWord, isLoading } = useWords();
  const { addNotification } = useNotification();

  const [phase, setPhase] = useState<Phase>("idle");
  const [showText, setShowText] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [micArmed, setMicArmed] = useState(false);
  const [turns, setTurns] = useState<DialogueTurn[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const busyRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sessionActiveRef = useRef(false);
  const resumeAudioContextRef = useRef<() => Promise<void>>(async () => undefined);

  const translation = (key: string) =>
    setTranslation(key, dialogueTranslation, languageContext);

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
    warmUpSpeechVoices();
  }, []);

  useEffect(() => {
    if (authContext.user?.uid) {
      getWord();
    }
  }, [authContext.user?.uid, learningPair]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [turns, phase, showText]);

  const appendTurn = useCallback((role: "user" | "assistant", text: string) => {
    setTurns((prev) => [
      ...prev,
      { id: `${role}-${Date.now()}-${prev.length}`, role, text },
    ]);
  }, []);

  const handleUtterance = useCallback(
    async (blob: Blob) => {
      if (busyRef.current || !sessionActiveRef.current) return;
      busyRef.current = true;
      setPhase("transcribing");

      try {
        const text = await transcribeAudio(blob, {
          // Auto language: Russian base + Latin vocabulary words.
          language: null,
          prompt: buildMixedSpeechPrompt(
            wordsHook.map((word) => word.word),
            pairConfig.sourceLang
          ),
        });
        if (!text.trim()) {
          setPhase("ready");
          return;
        }

        appendTurn("user", text);
        const history = messagesRef.current;
        const nextMessages: ChatMessage[] = [
          ...history,
          { role: "user", content: buildContinueUserPrompt(text) },
        ];

        setPhase("thinking");
        const reply = await chatWithLocalLlm(nextMessages);
        const saved = [
          ...history,
          { role: "user" as const, content: text },
          { role: "assistant" as const, content: reply },
        ];
        messagesRef.current = saved;
        setMessages(saved);
        appendTurn("assistant", reply);

        setPhase("speaking");
        await speakRussian(reply, "ru", pairConfig.sourceLang);
        await resumeAudioContextRef.current();
        setPhase("ready");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : translation("errorGeneric");
        const isWhisper =
          /whisper|transcription|recogn/i.test(message) ||
          message.includes("8000");
        addNotification(
          isWhisper ? translation("errorWhisper") : translation("errorGeneric"),
          NotificationKeys.ERROR
        );
        setPhase(sessionActiveRef.current ? "ready" : "idle");
      } finally {
        busyRef.current = false;
      }
    },
    [addNotification, appendTurn, pairConfig.sourceLang, translation, wordsHook]
  );

  // Arm mic only after intro — avoids iOS permission dialog blocking LLM start.
  const autoListenEnabled = micEnabled && micArmed;
  const listenPaused = phase !== "ready";

  const { listenState, level, resumeAudioContext } = useAutoVoiceListen({
    enabled: autoListenEnabled,
    paused: listenPaused,
    onUtterance: handleUtterance,
  });

  useEffect(() => {
    resumeAudioContextRef.current = resumeAudioContext;
  }, [resumeAudioContext]);

  const endDialogue = () => {
    stopSpeaking();
    busyRef.current = false;
    sessionActiveRef.current = false;
    setMicEnabled(true);
    setMicArmed(false);
    setTurns([]);
    setMessages([]);
    messagesRef.current = [];
    setPhase("idle");
  };

  const isSessionActive =
    phase !== "idle" || turns.length > 0 || sessionActiveRef.current;

  const toggleMic = () => {
    setMicEnabled((value) => !value);
  };

  const startDialogue = async () => {
    if (busyRef.current || !wordsHook.length) return;
    busyRef.current = true;
    sessionActiveRef.current = true;
    setMicArmed(false);
    setPhase("starting");
    setTurns([]);
    setMessages([]);
    messagesRef.current = [];

    try {
      const practiceWords = pickPracticeWords(wordsHook);
      const welcome = buildWelcomeText(pairConfig);
      const system = buildDialogueSystemPrompt(practiceWords, pairConfig);

      const seed: ChatMessage[] = [
        { role: "system", content: system },
        { role: "user", content: buildFirstQuestionUserPrompt(learningPair) },
      ];

      // Prove network path early (shows up in API logs immediately).
      void aiFetch(
        `${AI_CONFIG.llmBaseUrl.replace(/\/v1\/?$/, "")}/health`,
        { method: "GET" },
        8_000
      ).catch(() => undefined);

      // Kick LLM first — never wait on audio/mic unlock before the network call.
      const firstQuestionPromise = chatWithLocalLlm(seed);

      // Best-effort iOS audio unlock; must not block the dialogue pipeline.
      void unlockAudioSession();

      appendTurn("assistant", welcome);
      setPhase("speaking");
      await speakRussian(welcome, "ru", pairConfig.sourceLang);
      await resumeAudioContextRef.current();

      setPhase("thinking");
      const firstQuestion = await firstQuestionPromise;
      const nextMessages: ChatMessage[] = [
        { role: "system", content: system },
        {
          role: "user",
          content: "Я готов практиковать слова из словаря.",
        },
        { role: "assistant", content: firstQuestion },
      ];
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
      appendTurn("assistant", firstQuestion);

      setPhase("speaking");
      await speakRussian(firstQuestion, "ru", pairConfig.sourceLang);
      await resumeAudioContextRef.current();
      setMicArmed(true);
      setPhase("ready");
    } catch (error) {
      sessionActiveRef.current = false;
      setMicArmed(false);
      setPhase("idle");
      const message =
        error instanceof Error ? error.message : translation("errorLlm");
      addNotification(
        /timed out|fetch|network|Failed/i.test(message)
          ? message
          : translation("errorLlm"),
        NotificationKeys.ERROR
      );
    } finally {
      busyRef.current = false;
    }
  };

  const statusLabel = (() => {
    if (!micEnabled && phase === "ready") {
      return translation("micOff");
    }
    switch (phase) {
      case "transcribing":
        return translation("transcribing");
      case "starting":
      case "thinking":
        return translation("thinking");
      case "speaking":
        return translation("speaking");
      case "ready":
        if (listenState === "speech") return translation("listening");
        if (listenState === "idle") return translation("autoListening");
        if (listenState === "unsupported") return translation("errorMic");
        return translation("autoListening");
      default:
        return translation("subtitle");
    }
  })();

  if (isLoading && !wordsHook.length) {
    return (
      <Box sx={{ ...pageStack, alignItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!wordsHook.length) {
    return (
      <Box sx={pageStack}>
        <PageHeader title={translation("title")} />
        <EmptyState
          title={translation("emptyTitle")}
          description={translation("emptyDescription")}
          icon={<RecordVoiceOverIcon sx={{ fontSize: 40 }} />}
          action={
            <Button variant="contained" onClick={() => Router.push("/enter")}>
              {translation("addWords")}
            </Button>
          }
        />
      </Box>
    );
  }

  const isUserSpeaking = listenState === "speech";
  const lastTurn = turns[turns.length - 1];
  const isAssistantSpeaking =
    phase === "speaking" && lastTurn?.role === "assistant";

  const orbMode =
    isUserSpeaking && micEnabled
      ? "listening"
      : isAssistantSpeaking
      ? "speaking"
      : phase === "thinking" || phase === "transcribing" || phase === "starting"
      ? "thinking"
      : "idle";

  return (
    <Box
      sx={{
        ...pageStack,
        minHeight: { xs: "calc(100dvh - 120px)", sm: "auto" },
      }}
    >
      <PageHeader
        title={translation("title")}
        subtitle={`${wordsHook.length} ${translation("wordsInContext")}`}
        action={
          <IconButton
            aria-label={
              showText ? translation("hideText") : translation("showText")
            }
            onClick={() => setShowText((value) => !value)}
            color={showText ? "primary" : "default"}
          >
            {showText ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        }
      />

      <Box
        ref={listRef}
        sx={{
          ...surfaceCard,
          flex: 1,
          minHeight: 280,
          maxHeight: { xs: "calc(100dvh - 280px)", sm: 520 },
          overflowY: showText ? "auto" : "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        {!turns.length ? (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              px: 2,
              py: 4,
            }}
          >
            <Stack spacing={1.5} alignItems="center">
              <RecordVoiceOverIcon color="primary" sx={{ fontSize: 44 }} />
              <Typography color="text.secondary">
                {translation("subtitle")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {translation("autoListenHint")}
              </Typography>
              <Button
                variant="contained"
                onClick={startDialogue}
                disabled={phase === "starting" || phase === "thinking"}
              >
                {phase === "starting" || phase === "thinking"
                  ? translation("thinking")
                  : translation("start")}
              </Button>
            </Stack>
          </Box>
        ) : showText ? (
          turns.map((turn) => {
            const isUser = turn.role === "user";
            return (
              <Box
                key={turn.id}
                sx={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  px: 1.5,
                  py: 1.1,
                  borderRadius: 2,
                  bgcolor: isUser ? "primary.main" : "action.hover",
                  color: isUser ? "primary.contrastText" : "text.primary",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.8,
                    display: "block",
                    mb: 0.35,
                    fontWeight: 600,
                  }}
                >
                  {isUser ? translation("you") : translation("tutor")}
                </Typography>
                <Typography variant="body2">{turn.text}</Typography>
              </Box>
            );
          })
        ) : (
          <VoiceOrb mode={orbMode} level={level} label={statusLabel} />
        )}
      </Box>

      <Box sx={{ ...surfaceCard, textAlign: "center" }}>
        {showText ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {statusLabel}
          </Typography>
        ) : null}

        <Stack spacing={1.75} alignItems="center">
          <MicRipple active={isUserSpeaking && micEnabled} level={level}>
            <Fab
              color={micEnabled ? "primary" : "default"}
              onClick={toggleMic}
              disabled={phase === "idle" && !turns.length}
              aria-label={
                micEnabled ? translation("muteMic") : translation("unmuteMic")
              }
            >
              {micEnabled ? <MicIcon /> : <MicOffIcon />}
            </Fab>
          </MicRipple>

          {isSessionActive ? (
            <Button
              color="error"
              variant="outlined"
              startIcon={<CallEndIcon />}
              onClick={endDialogue}
              aria-label={translation("end")}
            >
              {translation("end")}
            </Button>
          ) : null}
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.25, display: "block" }}
        >
          {micEnabled ? translation("micOnHint") : translation("micOffHint")}
        </Typography>
      </Box>
    </Box>
  );
};

export default DialoguePage;
