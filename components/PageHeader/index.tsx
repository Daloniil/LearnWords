import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { pageSubtitle, pageTitle } from "../../Styles/shared";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 1,
      mb: 0.5,
    }}
  >
    <Box>
      <Typography component="h2" sx={pageTitle}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography component="p" sx={pageSubtitle}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
    {action}
  </Box>
);
