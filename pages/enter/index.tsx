import {
    Box,
    Button,
    capitalize,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Enter} from "../../Interfaces/EnterInterface";
import {lowerText} from "../../utils/lowerText";
import {useNotification} from "../../hooks/useNotification";
import {
    addStyle,
    modalContainerStyle,
    textFieldStyle,
    titleStyle,
    translateWord,
} from "../../Styles/EnterStyle";
import {
    LoginStatus,
    NotificationKeys,
} from "../../services/localKey";

import {useEffect, useState} from "react";
import {Translation} from "../../Interfaces/translation/translation";
import {TranslationService} from "../../services/translationService";
import {useDebounce} from "../../hooks/useDebounce";
import {boxTranslationStyle, loadingStyle} from "../../Styles/TestStyle";
import {enterTranslation} from "../../translation/Enter";
import {useLanguage} from "../../hooks/useLanguage";
import {setTranslation} from "../../utils/setTranslation";
import {useLogin} from "../../hooks/useLogin";
import {useWords} from "../../hooks/useWords";

const EnterPage = () => {
    const {addNotification} = useNotification();
    const {languageContext} = useLanguage();
    const {checkingLogin} = useLogin();
    const {addWord, speakWord} = useWords();

    const [translateEnglish, setTranslateEnglish] = useState("");
    const [translateRussian, setTranslateRussian] = useState("");

    const debouncedSearchValueEnglish = useDebounce(translateEnglish, 1000);
    const debouncedSearchValueRussian = useDebounce(translateRussian, 1000);

    const [loading, setLoading] = useState(false);
    const [translatedText, setTranslatedText] = useState("" as string);
    const [statusLoading, setStatusLoadingUser] = useState(false);

    const [lang, setLang] = useState("en");

    const schema = yup.object().shape({
        englishWord: yup.string().required("This Field Cannot Be Empty"),
        russianWord: yup.string().required("This Field Cannot Be Empty"),
    });
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
        reset,
        setValue,
    } = useForm<Enter>({resolver: yupResolver(schema)});

    const closeModalAdd = () => {
        reset({
            englishWord: "",
            russianWord: "",
        });
    };

    const addWords = async (data: Enter) => {
        setStatusLoadingUser(true);
        await addWord(data);
        setTranslateEnglish("");
        setTranslateRussian("");
        closeModalAdd();
        setStatusLoadingUser(false);
    };

    const handleTranslate = async (data: Translation[], lang: string) => {
        setLang(lang);
        const request = await TranslationService.translate(data, lang).catch(
            (e) => {
                addNotification(e.message, NotificationKeys.ERROR), setLoading(false);
            }
        );

        const result = request?.data.data.translatedText as string | undefined;
        setLoading(false);
        if (result) {
            setTranslatedText(result);
        }
    };

    const translation = (key: string) => {
        return setTranslation(key, enterTranslation, languageContext);
    };

    useEffect(() => {
        if (debouncedSearchValueEnglish) {
            handleTranslate([{Text: debouncedSearchValueEnglish}], "ru");
        }

    }, [debouncedSearchValueEnglish]);

    useEffect(() => {
        if (debouncedSearchValueRussian) {
            handleTranslate([{Text: debouncedSearchValueRussian}], "en");
        }
    }, [debouncedSearchValueRussian]);

    useEffect(() => {
        checkingLogin(LoginStatus.OTHER);
    }, []);

    return (
        <>
            <Box sx={titleStyle}>ANNA YOU CAN DO IT!! I BELIEVE IN YOU!!</Box>
            <Box sx={titleStyle}>{translation("enterWord")}</Box>
            <form
                onSubmit={handleSubmit((data) => {
                    data = lowerText(data);
                    addWords(data);
                })}
                style={{margin: "0 auto"}}
            >
                <Box sx={modalContainerStyle}>
                    <Box
                        sx={{
                            display: "flex",
                            margin: translateEnglish ? "0 0 0 -35px" : "",
                        }}
                    >
                        {translateEnglish ? (
                            <Typography
                                onClick={() => speakWord(translateEnglish)}
                                sx={{margin: "15px 0 0 0", transform: "translate(-10px, 0)"}}
                            >
                                <VolumeUpIcon fontSize="large" color="primary"/>
                            </Typography>
                        ) : (
                            ""
                        )}

                        <TextField
                            error={!!errors.englishWord}
                            sx={textFieldStyle}
                            label={translation("english")}
                            {...register("englishWord", {required: true})}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText={errors.englishWord?.message}
                            onChange={(e) => {
                                setLoading(true);
                                setTranslateEnglish(e.target.value);
                            }}
                        />
                    </Box>

                    <Box>
                        <TextField
                            error={!!errors.russianWord}
                            sx={textFieldStyle}
                            label={translation("russian")}
                            {...register("russianWord", {required: true})}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText={errors.russianWord?.message}
                            onChange={(e) => {
                                setLoading(true);
                                setTranslateRussian(e.target.value);
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{display: "block", margin: "0 0 5px -15px"}}>
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        {statusLoading ? (
                            <Box
                                sx={{
                                    transform: "translate(-50px, 20px)",
                                }}
                            >
                                <CircularProgress/>
                            </Box>
                        ) : (
                            ""
                        )}
                        <Box
                            style={{
                                margin: statusLoading ? "-5px 0 5px -25px" : "-5px 0 5px 15px",
                                display: translateEnglish || translateRussian ? "" : "none",
                            }}
                        >
                            <Typography sx={{textAlign: "center"}}>
                                {translation("translation")}
                            </Typography>

                            {loading ? (
                                <Box sx={loadingStyle}>
                                    <CircularProgress/>
                                </Box>
                            ) : (
                                <Box
                                    sx={boxTranslationStyle}
                                    onClick={() => {
                                        lang === "ru"
                                            ? setValue(
                                                "russianWord",
                                                translatedText
                                            )
                                            : setValue(
                                                "englishWord",
                                                translatedText
                                            );
                                    }}
                                >
                                    {lang === "ru" ? (
                                        <Typography lang={lang} sx={translateWord}>
                                            {translatedText[0]
                                                ? capitalize(translatedText)
                                                : ""}
                                        </Typography>
                                    ) : (
                                        <Typography lang="en" sx={translateWord}>
                                            {translatedText[0]
                                                ? capitalize(translatedText)
                                                : ""}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Button variant="outlined" size="medium" type="submit" sx={addStyle}>
                    {translation("addButton")}
                </Button>


            </form>
        </>
    );
};

export default EnterPage;