import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotification } from "../../hooks/useNotification";
import { NotificationKeys } from "../../services/localKey";
import { titleStyle } from "../../Styles/EditWordStyle";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";
import { boxSelect } from "../../Styles/FoldersStyle";

const useStyles = makeStyles({
  menuPaper: {
    maxHeight: 260,
  },
});

export const SelectFolder = ({
  handleCloseModal,
}: {
  handleCloseModal: (id: number) => void;
}) => {
  const { languageContext } = useLanguage();
  const { addNotification } = useNotification();
  const { foldersHook, getFolders, isLoading } = useFolders();

  const classes = useStyles();
  const [title, setTitle] = useState("-1");

  const handleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value as string);
  };

  const translation = (key: string) => {
    return setTranslation(key, folderTranslation, languageContext);
  };

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (!isLoading && foldersHook.length === 0) {
      addNotification("leastFive", NotificationKeys.ERROR);
      Router.push("/enter");
    }
  }, [foldersHook, isLoading]);

  return (
    <Box sx={{ width: "200px" }}>
      <Typography sx={titleStyle}>{translation("selectFolder")}</Typography>

      <Box sx={boxSelect}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {translation("Folders")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={title}
              label="Age"
              onChange={handleChange}
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              <MenuItem value={-1}>{translation("none")}</MenuItem>
              {foldersHook.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleCloseModal(item.id)}
                  value={item.id}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};
