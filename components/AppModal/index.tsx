import { Box, BoxProps } from "@mui/material";

type AppModalProps = BoxProps & {
  children: React.ReactNode;
};

export const AppModal = ({ children, sx, ...rest }: AppModalProps) => (
  <Box
    sx={[
      {
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
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
    {...rest}
  >
    {children}
  </Box>
);
