import {
  Box,
  capitalize,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Word } from "../../Interfaces/ProvidersInterface";
import { listCard } from "../../Styles/shared";

type WordCardProps = {
  word: Word;
  sourceLang: string;
  targetLang: string;
  onPress: () => void;
  onSpeak: () => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  blurTarget?: boolean;
  targetRevealed?: boolean;
  onRevealTarget?: () => void;
  revealHint?: string;
};

export const WordCard = ({
  word,
  sourceLang,
  targetLang,
  onPress,
  onSpeak,
  selectable,
  selected,
  onToggleSelect,
  blurTarget,
  targetRevealed,
  onRevealTarget,
  revealHint,
}: WordCardProps) => {
  const isHidden = blurTarget && !targetRevealed;

  return (
    <Box
      sx={{
        ...listCard,
        borderColor: selected ? "primary.main" : "divider",
      }}
      onClick={onPress}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {selectable ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            aria-label="select word"
          >
            {selected ? (
              <CheckCircleOutlineIcon color="primary" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
          </IconButton>
        ) : null}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak();
              }}
              aria-label="speak word"
            >
              <VolumeUpOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography
              lang={sourceLang}
              sx={{ fontWeight: 600, fontSize: "1rem", wordBreak: "break-word" }}
            >
              {capitalize(word.word)}
            </Typography>
          </Stack>

          <Box
            sx={{ mt: 0.5, pl: 4.5 }}
            onClick={(e) => {
              if (isHidden) {
                e.stopPropagation();
                onRevealTarget?.();
              }
            }}
          >
            <Typography
              lang={targetLang}
              color="text.secondary"
              sx={{
                fontSize: "0.95rem",
                wordBreak: "break-word",
                filter: isHidden ? "blur(7px)" : "none",
                opacity: isHidden ? 0.85 : 1,
                userSelect: isHidden ? "none" : "auto",
                transition: "filter 0.25s ease, opacity 0.25s ease",
                cursor: isHidden ? "pointer" : "inherit",
              }}
            >
              {capitalize(word.correctTranslation)}
            </Typography>
            {isHidden && revealHint ? (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                <Typography variant="caption" color="text.disabled">
                  {revealHint}
                </Typography>
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
