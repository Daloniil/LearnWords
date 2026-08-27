import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from "next/router";
import {
  Box,
  capitalize,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { statTranslation } from "../../translation/Stat";
import { OneStat, Stats } from "../../Interfaces/ProvidersInterface";
import { LoginStatus } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { useStats } from "../../hooks/useStats";
import {
  centeredLoader,
  listCard,
  pageStack,
  scrollList,
} from "../../Styles/shared";

const Stat = () => {
  const router = useRouter();
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();
  const { getStats, statsHook } = useStats();

  const [stats, setStats] = useState([] as Stats[]);
  const [stat, setStat] = useState([] as OneStat[]);
  const [statusLoading, setStatusLoading] = useState(false);

  const translation = (key: string) =>
    setTranslation(key, statTranslation, languageContext);

  useEffect(() => {
    if (stats.length > 0) {
      const item = stats.find((s) => s.id === Number(router.query.id));
      if (item) {
        setStat(item.stat);
      } else {
        Router.push("/stats");
      }
    }
  }, [stats, router.query.id]);

  useEffect(() => {
    setStats(statsHook ?? []);
    setStatusLoading(false);
  }, [statsHook]);

  useEffect(() => {
    setStatusLoading(true);
    getStats();
    checkingLogin(LoginStatus.OTHER);
  }, []);

  return (
    <Box sx={pageStack}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => Router.push("/stats")} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {translation("titleStat")} {Number(router.query.id) + 1}
        </Typography>
      </Stack>

      {statusLoading ? (
        <Box sx={centeredLoader}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack sx={scrollList}>
          {stat.map((word, index) => (
            <Box key={index} sx={listCard}>
              <Typography variant="body1">
                {index + 1}. {capitalize(word.word)} — {capitalize(word.translation)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Stat;
