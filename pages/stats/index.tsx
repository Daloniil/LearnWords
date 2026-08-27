import { useStats } from "../../hooks/useStats";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Router from "next/router";
import {
  Box,
  capitalize,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { statsTranslation } from "../../translation/Stats";
import { setTranslation } from "../../utils/setTranslation";
import { useEffect, useState } from "react";
import { LoginStatus } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { Stats } from "../../Interfaces/ProvidersInterface";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import {
  centeredLoader,
  listCard,
  pageStack,
  scrollList,
} from "../../Styles/shared";
import { scrollStatsStyle } from "../../Styles/StatsStyle";

const StatsPage = () => {
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();
  const { getStats, statsHook, deleteStats } = useStats();

  const [stats, setStats] = useState([] as Stats[]);
  const [statusLoading, setStatusLoading] = useState(false);

  const translation = (key: string) =>
    setTranslation(key, statsTranslation, languageContext);

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
      <PageHeader title={translation("titleStats")} />

      {statusLoading ? (
        <Box sx={centeredLoader}>
          <CircularProgress />
        </Box>
      ) : stats.length === 0 ? (
        <EmptyState
          title={
            languageContext === "english"
              ? "No stats yet"
              : "Статистики пока нет"
          }
          description={
            languageContext === "english"
              ? "Complete a test to see your mistakes here"
              : "Пройдите тест, чтобы увидеть ошибки"
          }
        />
      ) : (
        <Stack sx={{ ...scrollStatsStyle, ...scrollList }}>
          {stats.map((stat) => (
            <Box key={stat.id} sx={listCard}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                  onClick={() => Router.push(`/stats/${stat.id}`)}
                >
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                    {translation("test")} №{stat.id + 1}
                  </Typography>
                  {stat.stat[0] ? (
                    <Typography variant="body2" color="text.secondary">
                      1. {capitalize(stat.stat[0].word)} —{" "}
                      {capitalize(stat.stat[0].translation)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="success.main">
                      {translation("noErrors")}
                    </Typography>
                  )}
                  {stat.stat[1] ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      2. {capitalize(stat.stat[1].word)} —{" "}
                      {capitalize(stat.stat[1].translation)}
                    </Typography>
                  ) : null}
                </Box>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => deleteStats(stat.id)}
                  aria-label="delete stat"
                >
                  <DeleteOutlineIcon />
                </IconButton>
                <ChevronRightIcon color="disabled" />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default StatsPage;
