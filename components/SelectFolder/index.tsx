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
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { useNotification } from "../../hooks/useNotification";
import { NotificationKeys } from "../../services/localKey";
import { titleStyle } from "../../Styles/EditWordStyle";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { FoldersType } from "../../Interfaces/ProvidersInterface";
import { boxSelect } from "../../Styles/FoldersStyle";
import {
  createEmptyFoldersDoc,
  getFoldersFromDoc,
  normalizeFoldersDoc,
} from "../../utils/learningPair";

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
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { pairConfig } = useLearningPair();

  const classes = useStyles();

  const [foldersHook, setFoldersHook] = useState([] as FoldersType[]);
  const [title, setTitle] = useState("-1");

  const handleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value as string);
  };

  const translation = (key: string) => {
    return setTranslation(key, folderTranslation, languageContext);
  };

  const getFolders = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = normalizeFoldersDoc(docSnap.data());
        const folders = getFoldersFromDoc(data, pairConfig);
        setFoldersHook(folders);
        if (!folders.length) {
          addNotification("leastFive", NotificationKeys.ERROR);
          Router.push("/enter");
        }
      } else {
        setDoc(
          doc(db, "folders", authContext.user.uid),
          createEmptyFoldersDoc(authContext.user.uid)
        );
        Router.push("/enter");
      }
    }
  };

  useEffect(() => {
    getFolders();
  }, [pairConfig.pair]);

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
