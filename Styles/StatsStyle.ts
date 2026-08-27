export const statsTitleStyle = {
  textAlign: "left" as const,
  fontSize: "1.25rem",
  fontWeight: 700,
};

export const statsBoxStyle = {
  width: "100%",
};

export const scrollStatsStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 1.5,
  maxHeight: { xs: "calc(100dvh - 260px)", sm: 560 },
  overflowY: "auto" as const,
  pr: 0.5,
};

export const indentsBoxStyle = {
  flex: 1,
  minWidth: 0,
  cursor: "pointer",
};

export const titleTestStyle = {
  fontSize: "1rem",
  fontWeight: 700,
  mb: 0.5,
};

export const statBoxStyle = {
  width: "100%",
};

export const deleteButtonStyle = {
  cursor: "pointer",
};

export const elemStats = {
  fontSize: "0.875rem",
  color: "text.secondary",
  overflowWrap: "break-word" as const,
  wordBreak: "break-word" as const,
};
