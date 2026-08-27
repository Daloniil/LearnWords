export const titleStyle = {
  fontSize: { xs: "1.75rem", sm: "2rem" },
  textAlign: "center" as const,
  fontWeight: 800,
  my: 2,
  wordBreak: "break-word" as const,
};

export const pointsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 0.5,
  my: 2,
};

export const pointStyle = {
  display: "flex",
};

export const doneCorrectStyle = {
  borderRadius: "50%",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "success.main",
};

export const doneFailStyle = {
  borderRadius: "50%",
  width: 28,
  height: 28,
  bgcolor: "action.disabledBackground",
};

export const variantsBoxStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
  gap: 1.5,
  maxWidth: 480,
  mx: "auto",
  width: "100%",
};

export const variantStyle = {
  minHeight: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  bgcolor: "background.paper",
  cursor: "pointer",
  transition: "transform 0.1s ease, border-color 0.15s ease",
  "&:active": {
    transform: "scale(0.98)",
    bgcolor: "action.hover",
  },
};

export const variantTestStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  px: 1,
  wordBreak: "break-word" as const,
};

export const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  py: 2,
};

export const boxTranslationStyle = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  textAlign: "center" as const,
  p: 1.5,
};

export const statusBarStyle = {
  position: "sticky" as const,
  bottom: { xs: 72, md: 0 },
  mt: 3,
  pt: 2,
  pb: 1,
  bgcolor: "background.default",
  borderTop: "1px solid",
  borderColor: "divider",
};

export const percentBarStyle = {
  textAlign: "center",
  fontWeight: 700,
  mb: 0.5,
};

export const barStyle = {
  borderRadius: 1,
};

export const linearStyle = {
  display: "flex",
  alignItems: "center",
};

export const restartButtonStyle = {
  position: "absolute" as const,
  top: 8,
  right: 8,
  minWidth: 44,
  minHeight: 36,
};

export const circularProgress = {
  display: "flex",
  justifyContent: "center",
  py: 8,
};

export const testContainerStyle = {
  position: "relative" as const,
  minHeight: { xs: "calc(100dvh - 200px)", sm: 480 },
  display: "flex",
  flexDirection: "column" as const,
};
