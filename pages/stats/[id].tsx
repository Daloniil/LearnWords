import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStats } from "../../hooks/useStats";
import Router from "next/router";
import { Box, capitalize, Typography } from "@mui/material";
import { useLanguage } from "../../hooks/useLanguage";
import { setTranslation } from "../../utils/setTranslation";
import { statTranslation } from "../../translation/Stat";
import {
  indentsBoxStyle,
  statBoxStyle,
  statsTitleStyle,
} from "../../styles/StatsStyle";
import { OneStat } from "../../Interfaces/ProvidersInterface";

const Stat = () => {
  const router = useRouter();
  const { stats } = useStats();
  const { languageContext } = useLanguage();

  const [stat, setStat] = useState([] as OneStat[]);

  const translation = (key: string) => {
    return setTranslation(key, statTranslation, languageContext);
  };

  useEffect(() => {
    if (stats[stats.map((id) => id.id).indexOf(Number(router.query.id))]) {
      setStat(
        stats[stats.map((id) => id.id).indexOf(Number(router.query.id))].stat
      );
    } else {
      Router.push("/stats");
    }
  }, []);

  return (
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
  );
};

export default Stat;
