import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import Router from "next/router";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AddFolder } from "../../components/AddFolder";
import { useFolders } from "../../hooks/useFolders";
import { useLogin } from "../../hooks/useLogin";
import { LoginStatus } from "../../services/localKey";
import { useLanguage } from "../../hooks/useLanguage";
import { useLearningPair } from "../../hooks/useLearningPair";
import { getWordArrays } from "../../utils/wordHelpers";
import { folderTranslation } from "../../translation/Folder";
import { setTranslation } from "../../utils/setTranslation";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { AppModal } from "../../components/AppModal";
import {
  centeredLoader,
  listCard,
  pageStack,
  scrollList,
} from "../../Styles/shared";
import { scrollStatsStyle } from "../../Styles/StatsStyle";

const FoldersPage = () => {
  const { deleteFolder, foldersHook, isLoading, isValidating } = useFolders();
  const { checkingLogin } = useLogin();
  const { languageContext } = useLanguage();
  const { learningPair, pairConfig } = useLearningPair();

  const [openModal, setOpenModal] = useState(false);

  const translation = (key: string) =>
    setTranslation(key, folderTranslation, languageContext);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    checkingLogin(LoginStatus.OTHER);
  }, [learningPair]);

  const showLoader = isLoading && foldersHook.length === 0;

  return (
    <Box sx={pageStack}>
      <PageHeader
        title={translation("folders")}
        subtitle={
          isValidating
            ? languageContext === "english"
              ? "Updating…"
              : "Обновление…"
            : undefined
        }
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            {translation("add")}
          </Button>
        }
      />

      {showLoader ? (
        <Box sx={centeredLoader}>
          <CircularProgress />
        </Box>
      ) : foldersHook.length === 0 ? (
        <EmptyState
          icon={<FolderOutlinedIcon sx={{ fontSize: 40 }} />}
          title={
            languageContext === "english" ? "No folders yet" : "Папок пока нет"
          }
          description={
            languageContext === "english"
              ? "Create a folder to organize words for tests"
              : "Создайте папку для организации слов в тестах"
          }
          action={
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              {translation("add")}
            </Button>
          }
        />
      ) : (
        <Stack sx={{ ...scrollStatsStyle, ...scrollList }}>
          {foldersHook.map((item) => {
            const { sourceWords } = getWordArrays(item, pairConfig);
            return (
              <Box key={item.id} sx={listCard}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{ flex: 1, minWidth: 0 }}
                    onClick={() => Router.push(`/folders/${item.id}`)}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sourceWords.length}{" "}
                      {languageContext === "english" ? "words" : "слов"}
                    </Typography>
                    {sourceWords.slice(0, 2).map((word, idx) => (
                      <Typography
                        key={word.id}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {idx + 1}. {capitalize(word.word)} —{" "}
                        {capitalize(word.correctTranslation)}
                      </Typography>
                    ))}
                  </Box>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => deleteFolder(item.id)}
                    aria-label="delete folder"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <ChevronRightIcon color="disabled" />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <AppModal>
          <AddFolder handleCloseModal={handleCloseModal} />
        </AppModal>
      </Modal>
    </Box>
  );
};

export default FoldersPage;
