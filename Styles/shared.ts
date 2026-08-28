import { SxProps, Theme } from "@mui/material";

export const pageStack: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  pb: 1,
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
};

export const pageFill: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
};

export const surfaceCard: SxProps<Theme> = {
  p: 2,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

export const modalPaper: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: 420 },
  maxWidth: "92vw",
  p: 2.5,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow: (theme) =>
    theme.palette.mode === "light"
      ? "0 8px 32px rgba(15, 23, 42, 0.12)"
      : "0 8px 32px rgba(0, 0, 0, 0.4)",
  outline: "none",
};

export const listCard: SxProps<Theme> = {
  p: 1.5,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  cursor: "pointer",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
  "&:active": {
    bgcolor: "action.selected",
  },
};

export const pageTitle: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: "1.15rem", sm: "1.35rem" },
  color: "text.primary",
  mb: 0.5,
};

export const pageSubtitle: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.875rem",
  mb: 1,
};

export const fullWidthButton: SxProps<Theme> = {
  width: "100%",
  mt: 1,
};

export const scrollList: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  maxHeight: { xs: "calc(100dvh - 280px)", sm: 560 },
  overflowY: "auto",
  pr: 0.5,
};

export const scrollListFill: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  pr: 0.5,
  pb: 1,
  WebkitOverflowScrolling: "touch",
};

export const centeredLoader: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 6,
};

export const toolbarSpacer: SxProps<Theme> = {
  minHeight: { xs: 56, sm: 64 },
};

export const bottomNavOffset: SxProps<Theme> = {
  pb: {
    xs: "calc(56px + env(safe-area-inset-bottom) + 12px)",
    sm: 2,
  },
};
