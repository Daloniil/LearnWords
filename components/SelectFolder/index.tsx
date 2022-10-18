import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotification } from "../../hooks/useNotification";
import { NotificationKeys } from "../../services/localKey";
import { titleStyle } from "../../Styles/EditWordStyle";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { FoldersType } from "../../Interfaces/ProvidersInterface";
import { boxSelect } from "../../Styles/FoldersStyle";

export const SelectFolder = ({
  handleCloseModal,
}: {
  handleCloseModal: (id: number) => void;
}) => {
  const { languageContext } = useLanguage();
  const { authContext } = useAuth();
  const { addNotification } = useNotification();

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
        setFoldersHook(docSnap.data().folders);
        if (!docSnap.data().folders.length) {
          if (!foldersHook.length) {
            addNotification("leastFive", NotificationKeys.ERROR);
            Router.push("/enter");
          }
        }
      } else {
        const db = getFirestore();
        const collectionId = "folders";
        const documentId = authContext.user.uid;

        const value = {
          folders: [],
          uid: authContext.user.uid,
        };
        setDoc(doc(db, collectionId, documentId), value);
        Router.push("/enter");
      }
    }
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <Box sx={{ width: "200px" }}>
      <Typography sx={titleStyle}>{translation("selectFolder")}</Typography>

      <Box sx={boxSelect}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {" "}
              {translation("Folders")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={title}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={-1}>{translation("none")}</MenuItem>
              {foldersHook.map((item) => (
                <MenuItem
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
