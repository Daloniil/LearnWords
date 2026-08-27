import { Box, Typography } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => (
  <Box
    role="status"
    sx={{
      textAlign: "center",
      py: 5,
      px: 2,
      borderRadius: 2,
      border: "1px dashed",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Box sx={{ color: "text.secondary", mb: 1.5 }}>
      {icon ?? <MenuBookOutlinedIcon sx={{ fontSize: 40 }} />}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
      {title}
    </Typography>
    {description ? (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
    ) : null}
    {action}
  </Box>
);
