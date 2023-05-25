import {
    Box,
    Button,
    capitalize,
    CircularProgress,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import SearchIcon from "@mui/icons-material/Search";
import {useEffect, useState} from "react";
import {useSearch} from "../../hooks/useSearch";
import {Word} from "../../Interfaces/ProvidersInterface";
import {
    buttonSelect,
    circularProgressDictionary,
    modalStyle,
    rowStyle,
    rowStyleDark,
    searchStyle,
    tableCellStyle,
    titleWordsStyle,
    wordsStyle,
} from "../../Styles/DictionaryStyle";
import {EditWord} from "../../components/EditWord";
import {useLanguage} from "../../hooks/useLanguage";
import {dictionaryTranslation} from "../../translation/Dictionary";
import {setTranslation} from "../../utils/setTranslation";
import {useTheme} from "../../hooks/useTheme";
import {LoginStatus, NotificationKeys} from "../../services/localKey";
import {useLogin} from "../../hooks/useLogin";
import {useWords} from "../../hooks/useWords";
import {AddToFolder} from "../../components/AddToFolder";
import {useNotification} from "../../hooks/useNotification";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const DictionaryPage = () => {
    const {search} = useSearch();
    const {languageContext} = useLanguage();
    const {themeContext} = useTheme();
    const {checkingLogin} = useLogin();
    const {getWord, wordsHook, speakWord} = useWords();
    const {addNotification} = useNotification();

    const [words, setWords] = useState([] as Word[]);
    const [statusDelete, setStatusDelete] = useState(false);
    const [editWord, setEditWord] = useState({} as Word);
    const [searchWord, setSearchWord] = useState("");

    const [editId, setEditId] = useState(0);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalFolder, setOpenModalFolder] = useState(false);
    const [statusLoading, setStatusLoadingUser] = useState(false);

    const [windowHeight, setWindowHeight] = useState(550);
    const [selectStatus, setSelectStatus] = useState(false);
    const [selectStatusComp, setSelectStatusComp] = useState([] as boolean[]);
    const [moveWord, setMoveWord] = useState([] as Word[]);


    const handleWithOutUpdate = () => setOpenModalEdit(!openModalEdit);

    const handleCloseModalEdit = () => {
        setOpenModalEdit(!openModalEdit);
        getWord();
        clearStatus(false)
    };

    const handleCloseModalFolder = () => {
        if (moveWord.length) {
            setOpenModalFolder(!openModalFolder);
        } else {
            addNotification("selectWords", NotificationKeys.ERROR);
        }
    };

    const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchWord(e.target.value.toLowerCase());


    const searchingWord = () => {
        const wordsArray = search(words, searchWord);
        setWords(wordsArray);
    };

    const setWordModal = (word: Word) => {
        handleWithOutUpdate();
        setEditWord(word);
        setEditId(word.id);
    };

    const translation = (key: string) => {
        return setTranslation(key, dictionaryTranslation, languageContext);
    };

    const emptyStatus = () => {
        const statusArr = [];
        for (let i = 0; i <= words.length; i++) {
            statusArr.push(false);
        }
        setSelectStatusComp(statusArr);
    };

    const clearStatus = (stat?: boolean) => {
        setSelectStatus(stat ?? !selectStatus), emptyStatus(), setMoveWord([]);
    };

    const clickSelectButton = (index: number, item: Word) => {
        setSelectStatusComp([]);
        setTimeout(() => {
            const edit = selectStatusComp;
            edit[index] = !edit[index];
            if (edit[index]) {
                moveWord.push(item);
            } else {
                moveWord.splice(moveWord.map((el) => el.id).indexOf(item.id), 1);
            }
            setSelectStatusComp(edit);
        }, 1);
    };

    useEffect(() => {
        setStatusDelete(false);
    }, [statusDelete]);

    useEffect(() => {
        if (searchWord) {
            searchingWord();
        } else {
            setStatusLoadingUser(true);
            getWord();
        }
    }, [searchWord]);

    useEffect(() => {
        setWords(wordsHook);
        setWindowHeight(window.outerHeight);
        setStatusLoadingUser(false);
    }, [wordsHook]);

    useEffect(() => {
        checkingLogin(LoginStatus.OTHER);
        setStatusLoadingUser(true);
        getWord();
    }, []);

    useEffect(() => {
        emptyStatus();
    }, [words]);
        alert("Привет")

    return (
        <>
            <Modal
                open={openModalEdit}
                onClose={handleWithOutUpdate}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box
                    sx={modalStyle}
                    style={{
                        backgroundColor: themeContext === "dark" ? "#232323" : "white",
                    }}
                >
                    <EditWord
                        editId={editId}
                        wordEdit={editWord}
                        handleCloseModal={handleCloseModalEdit}
                        setStatusLoadingUser={setStatusLoadingUser}
                    />
                </Box>
            </Modal>


            <Modal
                open={openModalFolder}
                onClose={handleCloseModalFolder}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box
                    sx={modalStyle}
                    style={{
                        backgroundColor: themeContext === "dark" ? "#232323" : "white",
                    }}
                >
                    <AddToFolder
                        handleCloseModal={handleCloseModalFolder}
                        moveWord={moveWord}
                    />
                </Box>
            </Modal>

            <Box sx={{display: "flex"}}>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    placeholder={translation("searchWord")}
                    sx={searchStyle}
                    onChange={textFieldChange}
                    InputProps={{
                        endAdornment: <SearchIcon/>,
                    }}
                />
                {selectStatus ? (
                    <Box sx={{display: "flex"}}>
                        <Button sx={buttonSelect} onClick={() => clearStatus()}>
                            {translation("cancel")}
                        </Button>
                        <Button
                            sx={{fontSize: "14px"}}
                            onClick={() => handleCloseModalFolder()}
                        >
                            {translation("add")}
                        </Button>
                    </Box>
                ) : (
                    <Button sx={buttonSelect} onClick={() => clearStatus()}>
                        {translation("select")}
                    </Button>
                )}
            </Box>

            <Paper sx={{overflow: "hidden"}}>
                <TableContainer
                    sx={{maxHeight: (windowHeight / 100) * 63, margin: "0 0 0 0"}}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography sx={titleWordsStyle}>
                                        {translation("english")}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={titleWordsStyle}>
                                        {translation("russian")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {statusLoading ? (
                            <CircularProgress sx={circularProgressDictionary}/>
                        ) : (
                            <TableBody>
                                {words.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        onClick={() => {
                                            setWordModal(item);
                                        }}
                                        sx={themeContext === "dark" ? rowStyleDark : rowStyle}
                                    >
                                        <TableCell sx={{maxWidth: "150px"}}>
                                            <Typography sx={tableCellStyle}>
                                                {selectStatus ? (
                                                    <Typography
                                                        sx={{margin: "5px 10px 0 35px"}}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clickSelectButton(index, item);
                                                        }}
                                                    >

                                                        {selectStatusComp[index] ? <CheckCircleOutlineIcon/> :
                                                            <RadioButtonUncheckedIcon/>}
                                                    </Typography>
                                                ) : (
                                                    ""
                                                )}
                                                <Typography
                                                    onClick={(e) => {
                                                        e.stopPropagation(), speakWord(item.word);
                                                    }}
                                                    sx={{margin: "3px 0 0 0"}}
                                                >
                                                    <VolumeUpIcon fontSize="medium" color="primary"/>
                                                </Typography>
                                                <Typography lang="en" sx={wordsStyle}>
                                                    {capitalize(item.word)}
                                                </Typography>
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{maxWidth: "150px"}}
                                        >
                                            <Typography lang="ru" sx={wordsStyle}>
                                                {capitalize(item.correctTranslation)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default DictionaryPage;
