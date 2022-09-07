import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from "next/router";
import { Box, capitalize, CircularProgress, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { statTranslation } from "../../translation/Stat";
import {
  indentsBoxStyle,
  statBoxStyle,
  statsTitleStyle,
} from "../../Styles/StatsStyle";
import { OneStat, Stats } from "../../Interfaces/ProvidersInterface";
import { LoginStatus } from "../../services/localKey";
import { useLogin } from "../../hooks/useLogin";
import { useStats } from "../../hooks/useStats";

const Stat = () => {
  const router = useRouter();
  const { languageContext } = useLanguage();
  const { checkingLogin } = useLogin();
  const { getStats, statsHook } = useStats();

  const [stats, setStats] = useState([] as Stats[]);
  const [stat, setStat] = useState([] as OneStat[]);
  const [statusLoading, setStatusLoading] = useState(false);

  const translation = (key: string) => {
    return setTranslation(key, statTranslation, languageContext);
  };

  useEffect(() => {
    if (stats && stats.length > 0) {
      if (stats[stats.map((id) => id.id).indexOf(Number(router.query.id))]) {
        setStat(
          stats[stats.map((id) => id.id).indexOf(Number(router.query.id))].stat
        );
      } else {
        Router.push("/stats");
      }
    }
  }, [stats]);

  useEffect(() => {
    //@ts-ignore
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
      {statusLoading ? (
        <CircularProgress
          sx={{
            minWidth: "100px",
            minHeight: "100px",
            margin: "25px auto 25px auto",
          }}
        />
      ) : (
        <>
          <Typography sx={statsTitleStyle}>
            {translation("titleStat")} {Number(router.query.id) + 1}
          </Typography>
          <Box sx={statBoxStyle}>
            {stat.map((word, index) => (
              <Typography key={index} sx={indentsBoxStyle}>
                {index + 1}. {capitalize(word.word)} {""} - {""}
                {capitalize(word.translation)}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default Stat;
