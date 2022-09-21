import { Box, Button, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { useStats } from "../../hooks/useStats";
import { useTheme } from "../../hooks/useTheme";
import { RestartTestProps } from "../../Interfaces/RestartTestInterface";
import {
  buttonContainerStyle,
  buttonStyle,
  titleStyle,
} from "../../Styles/RestartTestStyle";
import { restartTestTranslation } from "../../translation/RestartTest";
import { setTranslation } from "../../utils/setTranslation";

export const RestartTest = ({
  handleCloseModal,
  restartTest,
}: RestartTestProps) => {
  const { languageContext } = useLanguage();
  const { addStatsServer } = useStats();
  const { themeContext } = useTheme();

  const translation = (key: string) => {
    return setTranslation(key, restartTestTranslation, languageContext);
  };

  return (
    <Box
      sx={{
        backgroundColor: themeContext === "dark" ? "black" : "white",
        borderRadius: "5px",
      }}
    >
      <Typography sx={titleStyle}>{translation("wantToRestart")}</Typography>

      <Box sx={buttonContainerStyle}>
        <Button
          onClick={() => {
            restartTest(), addStatsServer();
          }}
          variant="contained"
          color="success"
          sx={buttonStyle}
        >
          {translation("yes")}
        </Button>
        <Button
          onClick={handleCloseModal}
          variant="outlined"
          color="error"
          sx={buttonStyle}
        >
          {translation("no")}
        </Button>
      </Box>
    </Box>
  );
};
