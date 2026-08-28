import { Box } from "@mui/material";

type VoiceWaveformProps = {
  active?: boolean;
  variant?: "user" | "assistant";
  bars?: number;
};

export const VoiceWaveform = ({
  active = false,
  variant = "assistant",
  bars = 24,
}: VoiceWaveformProps) => {
  const color =
    variant === "user" ? "rgba(255,255,255,0.92)" : "primary.main";

  return (
    <Box
      aria-hidden
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        height: 28,
        minWidth: 120,
        px: 0.25,
      }}
    >
      {Array.from({ length: bars }).map((_, index) => {
        const mid = bars / 2;
        const distance = Math.abs(index - mid) / mid;
        const base = 0.28 + (1 - distance) * 0.55;
        const delay = `${(index % 8) * 0.07}s`;
        return (
          <Box
            key={index}
            sx={{
              width: 2.5,
              borderRadius: 1,
              bgcolor: color,
              opacity: active ? 0.95 : 0.45,
              height: `${Math.max(6, base * 22)}px`,
              transformOrigin: "center",
              animation: active
                ? `voiceBar 0.9s ease-in-out ${delay} infinite`
                : "none",
              "@keyframes voiceBar": {
                "0%, 100%": {
                  transform: "scaleY(0.45)",
                },
                "50%": {
                  transform: `scaleY(${0.75 + (index % 5) * 0.12})`,
                },
              },
            }}
          />
        );
      })}
    </Box>
  );
};
