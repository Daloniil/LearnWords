import {
    Box,
    Button,
    capitalize,
    CircularProgress,
    Modal,
    Typography,
} from "@mui/material";
import Router from "next/router";
import {useEffect, useState} from "react";
import {AddFolder} from "../../components/AddFolder";
import {useFolders} from "../../hooks/useFolders";
import {useLogin} from "../../hooks/useLogin";
import {useTheme} from "../../hooks/useTheme";
import {LoginStatus} from "../../services/localKey";
import {modalStyle} from "../../Styles/DictionaryStyle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
    deleteButtonStyle,
    elemStats,
    indentsBoxStyle,
    scrollStatsStyle,
    statsBoxStyle,
    titleTestStyle,
} from "../../Styles/StatsStyle";
import {titleFolders, topBarFolder} from "../../Styles/FoldersStyle";
import {useLanguage} from "../../hooks/useLanguage";
import {folderTranslation} from "../../translation/Folder";
import {setTranslation} from "../../utils/setTranslation";

const FoldersPage = () => {
    const {getFolders, deleteFolder, foldersHook} = useFolders();
    const {checkingLogin} = useLogin();
    const {themeContext} = useTheme();
    const {languageContext} = useLanguage();

    const [openModal, setOpenModal] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(!openModal);
        if (openModal) {
            reload();
        }
        getFolders();
    };

    const reload = () => {
        setStatusLoading(true);
        setTimeout(() => {
            setStatusLoading(false);
        }, 700);
    };

    const translation = (key: string) => {
        return setTranslation(key, folderTranslation, languageContext);
    };

    useEffect(() => {
        checkingLogin(LoginStatus.OTHER);
        reload();
        getFolders();
    }, []);
    return (
        <>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box
                    sx={modalStyle}
                    style={{
                        backgroundColor: themeContext === "dark" ? "#232323" : "white",
                    }}
                >
                    <AddFolder handleCloseModal={handleCloseModal}/>
                </Box>
            </Modal>
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
                    <Box sx={topBarFolder}>
                        <Typography sx={titleFolders}>{translation("folders")}</Typography>
                        <Button
                            onClick={() => handleCloseModal()}
                            sx={{margin: "0 0 0 auto"}}
                        >
                            {translation("add")}
                        </Button>
                    </Box>

                    <Box sx={scrollStatsStyle}>
                        {foldersHook.map((item, index) => (
                            <Box key={item.id} sx={statsBoxStyle}>
                                <Typography
                                    sx={deleteButtonStyle}
                                    onClick={() => {
                                        reload(),
                                            deleteFolder(item.id)
                                    }}
                                    color={"error"}
                                >
                                    <DeleteForeverIcon/>
                                </Typography>
                                <Box
                                    sx={indentsBoxStyle}
                                    onClick={() => Router.push(`/folders/${item.id}`)}
                                >
                                    <Typography sx={titleTestStyle}>{item.name}</Typography>

                                    <Typography sx={elemStats} lang="ru">
                                        {item.englishWords[0]
                                            ? `     1. ${capitalize(item.englishWords[0].word)}
                - 
                ${capitalize(item.englishWords[0].correctTranslation)}`
                                            : ""}
                                    </Typography>

                                    {item.englishWords[1]
                                        ? `     2. ${capitalize(item.englishWords[1].word)}
                - 
                ${capitalize(item.englishWords[1].correctTranslation)}`
                                        : ""}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </>
    );
};

export default FoldersPage;
