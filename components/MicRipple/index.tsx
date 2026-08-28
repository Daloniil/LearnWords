import { Box } from "@mui/material";
import { ReactNode } from "react";

type MicRippleProps = {
  active: boolean;
  level?: number;
  children: ReactNode;
};

export const MicRipple = ({ active, level = 0, children }: MicRippleProps) => {
  const intensity = active ? Math.min(1, Math.max(0.25, level * 8)) : 0;

  return (
    <Box
      sx={{
        position: "relative",
        width: 72,
        height: 72,
        display: "grid",
        placeItems: "center",
      }}
    >
      {[0, 1, 2].map((ring) => (
        <Box
          key={ring}
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: "primary.main",
            opacity: active ? 0.45 - ring * 0.1 : 0,
            transform: active
              ? `scale(${1.15 + ring * 0.28 + intensity * 0.2})`
              : "scale(1)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            animation: active
              ? `micRipple 1.4s ease-out ${ring * 0.25}s infinite`
              : "none",
            "@keyframes micRipple": {
              "0%": {
                transform: "scale(1)",
                opacity: 0.5,
              },
              "100%": {
                transform: "scale(1.85)",
                opacity: 0,
              },
            },
            pointerEvents: "none",
          }}
        />
      ))}
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};
