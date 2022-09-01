import { Box, LinearProgress, LinearProgressProps } from "@mui/material";
import { linearStyle } from "../../Styles/TestStyle";

export const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  return (
    <Box sx={linearStyle}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} color="warning" />
      </Box>
    </Box>
  );
};
