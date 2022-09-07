import { useStats } from "../../hooks/useStats";
import Router from "next/router";
import { Box, capitalize, CircularProgress, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { statsTranslation } from "../../translation/Stats";
import { setTranslation } from "../../utils/setTranslation";

import {
  deleteButtonStyle,
  indentsBoxStyle,
  scrollStatsStyle,
  statsBoxStyle,
  statsTitleStyle,
  titleTestStyle,
} from "../../Styles/StatsStyle";
import { useEffect, useState } from "react";
import { LoginStatus } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { Stats } from "../../Interfaces/ProvidersInterface";

const StatsPage = () => {
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();
  const { getStats, statsHook, deleteStats } = useStats();

  const [stats, setStats] = useState([] as Stats[]);
  const [statusLoading, setStatusLoading] = useState(false);

  const translation = (key: string) => {
    return setTranslation(key, statsTranslation, languageContext);
  };

  useEffect(() => {
    setStats(statsHook);
    setStatusLoading(false);
  }, [statsHook]);

  useEffect(() => {
    setStatusLoading(true);
    getStats();
    checkingLogin(LoginStatus.OTHER);
  }, []);
  return (
    <>
      <Typography sx={statsTitleStyle}>{translation("titleStats")}</Typography>
      {statusLoading ? (
        <CircularProgress
          sx={{
            minWidth: "100px",
            minHeight: "100px",
            margin: "25px auto 25px auto",
          }}
        />
      ) : (
        <Box sx={scrollStatsStyle}>
          {stats.map((stat) => (
            <Box key={stat.id} sx={statsBoxStyle}>
              <Typography
                sx={deleteButtonStyle}
                onClick={() => deleteStats(stat.id)}
                color={"error"}
              >
                X
              </Typography>
              <Box
                sx={indentsBoxStyle}
                onClick={() => Router.push(`/stats/${stat.id}`)}
              >
                <Typography sx={titleTestStyle}>
                  {translation("test")} {stat.id + 1}
                </Typography>

                <Typography>
                  {stat.stat[0]
                    ? `     1. ${capitalize(stat.stat[0].word)}
                - 
                ${capitalize(stat.stat[0].translation)}`
                    : `${translation("noErrors")}`}
                </Typography>

                {stat.stat[1] ? (
                  <Typography>
                    2. {capitalize(stat.stat[1].word)}
                    {""} - {""}
                    {capitalize(stat.stat[1].translation)}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default StatsPage;
