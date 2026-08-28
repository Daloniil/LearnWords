import { Box, Typography } from "@mui/material";

type VoiceOrbMode = "idle" | "listening" | "speaking" | "thinking";

type VoiceOrbProps = {
  mode: VoiceOrbMode;
  level?: number;
  label?: string;
};

export const VoiceOrb = ({ mode, level = 0, label }: VoiceOrbProps) => {
  const active = mode === "speaking" || mode === "listening";
  const thinking = mode === "thinking";
  const scaleBoost =
    mode === "listening" ? 1 + Math.min(0.18, level * 4) : active ? 1.06 : 1;

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
        py: 4,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: 168, sm: 200 },
          height: { xs: 168, sm: 200 },
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Soft outer glow */}
        <Box
          sx={{
            position: "absolute",
            inset: "-18%",
            borderRadius: "50%",
            background:
              mode === "listening"
                ? "radial-gradient(circle, rgba(100,181,246,0.28) 0%, transparent 70%)"
                : mode === "speaking"
                ? "radial-gradient(circle, rgba(77,182,172,0.26) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            filter: "blur(8px)",
            animation: active || thinking ? "orbGlow 2.4s ease-in-out infinite" : "none",
            "@keyframes orbGlow": {
              "0%, 100%": { opacity: 0.55, transform: "scale(0.96)" },
              "50%": { opacity: 1, transform: "scale(1.05)" },
            },
          }}
        />

        {/* Morphing core */}
        <Box
          sx={{
            width: "72%",
            height: "72%",
            borderRadius: "42% 58% 48% 52% / 48% 42% 58% 52%",
            position: "relative",
            transform: `scale(${scaleBoost})`,
            transition: "transform 120ms linear",
            background: `
              radial-gradient(circle at 30% 28%, rgba(255,255,255,0.55), transparent 36%),
              radial-gradient(circle at 70% 70%, rgba(100,181,246,0.35), transparent 42%),
              linear-gradient(145deg, #2a2f38 0%, #111318 45%, #0a0b0e 100%)
            `,
            boxShadow: `
              inset 0 0 28px rgba(255,255,255,0.08),
              0 18px 40px rgba(0,0,0,0.45)
            `,
            animation:
              mode === "speaking"
                ? "orbSpeak 1.1s ease-in-out infinite"
                : mode === "listening"
                ? "orbListen 1.4s ease-in-out infinite"
                : thinking
                ? "orbThink 2s ease-in-out infinite"
                : "orbIdle 4.5s ease-in-out infinite",
            "@keyframes orbIdle": {
              "0%, 100%": {
                borderRadius: "42% 58% 48% 52% / 48% 42% 58% 52%",
                transform: "scale(1) rotate(0deg)",
              },
              "50%": {
                borderRadius: "52% 48% 42% 58% / 42% 55% 45% 58%",
                transform: "scale(1.03) rotate(4deg)",
              },
            },
            "@keyframes orbSpeak": {
              "0%, 100%": {
                borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
                transform: "scale(1.02) rotate(-2deg)",
              },
              "33%": {
                borderRadius: "58% 42% 45% 55% / 42% 58% 42% 58%",
                transform: "scale(1.1) rotate(3deg)",
              },
              "66%": {
                borderRadius: "45% 55% 60% 40% / 58% 45% 55% 42%",
                transform: "scale(1.06) rotate(-4deg)",
              },
            },
            "@keyframes orbListen": {
              "0%, 100%": {
                borderRadius: "48% 52% 45% 55% / 52% 45% 55% 48%",
                transform: "scale(1.04)",
              },
              "50%": {
                borderRadius: "55% 45% 52% 48% / 45% 55% 45% 55%",
                transform: "scale(1.12)",
              },
            },
            "@keyframes orbThink": {
              "0%, 100%": { opacity: 0.85, transform: "scale(0.98)" },
              "50%": { opacity: 1, transform: "scale(1.04)" },
            },
          }}
        />
      </Box>

      {label ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          {label}
        </Typography>
      ) : null}
    </Box>
  );
};
