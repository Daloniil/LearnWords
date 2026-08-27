import { Box, Button, Stack, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { useStats } from "../../hooks/useStats";
import { RestartTestProps } from "../../Interfaces/RestartTestInterface";
import { restartTestTranslation } from "../../translation/RestartTest";
import { setTranslation } from "../../utils/setTranslation";
import { fullWidthButton } from "../../Styles/shared";

export const RestartTest = ({
  handleCloseModal,
  restartTest,
}: RestartTestProps) => {
  const { languageContext } = useLanguage();
  const { addStatsServer } = useStats();

  const translation = (key: string) =>
    setTranslation(key, restartTestTranslation, languageContext);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
        {translation("wantToRestart")}
      </Typography>

      <Stack spacing={1.5}>
        <Button
          onClick={() => {
            restartTest();
            addStatsServer();
          }}
          variant="contained"
          color="primary"
          sx={fullWidthButton}
        >
          {translation("yes")}
        </Button>
        <Button
          onClick={handleCloseModal}
          variant="outlined"
          sx={fullWidthButton}
        >
          {translation("no")}
        </Button>
      </Stack>
    </Box>
  );
};
