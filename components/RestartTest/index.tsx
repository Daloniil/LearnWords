import { Box, Button, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { useStats } from "../../hooks/useStats";
import { RestartTestProps } from "../../Interfaces/RestartTestInterface";
import {
  buttonContainerStyle,
  buttonStyle,
  titleStyle,
} from "../../styles/RestartTestStyle";
import { restartTestTranslation } from "../../translation/RestartTest";
import { setTranslation } from "../../utils/setTranslation";

export const RestartTest = ({
  handleCloseModal,
  restartTest,
}: RestartTestProps) => {
  const { languageContext } = useLanguage();
  const { addStats } = useStats();

  const translation = (key: string) => {
    return setTranslation(key, restartTestTranslation, languageContext);
  };

  return (
    <>
      <Typography sx={titleStyle}>{translation("wantToRestart")}</Typography>

      <Box sx={buttonContainerStyle}>
        <Button
          onClick={() => {
            restartTest(), addStats();
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
    </>
  );
};
