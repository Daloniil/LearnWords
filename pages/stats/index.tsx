import { useStats } from "../../hooks/useStats";
import Router from "next/router";
import { Box, capitalize, Typography } from "@mui/material";
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

const StatsPage = () => {
  const { stats, deleteStats } = useStats();
  const { languageContext } = useLanguage();

  const translation = (key: string) => {
    return setTranslation(key, statsTranslation, languageContext);
  };

  return (
    <>
      <Typography sx={statsTitleStyle}>{translation("titleStats")}</Typography>
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
    </>
  );
};

export default StatsPage;
