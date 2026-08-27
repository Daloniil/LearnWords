import {Word} from "../Interfaces/ProvidersInterface";
import {ColorKeys, StatusFind} from "../services/localKey";
import {shuffle} from "../utils/shuffle";

export const useTest = () => {
    const getRandom = (max: number, optionsWord: Word[], correctWord: string) => {
        const indices = [] as number[];
        for (let i = 0; indices.length <= 2; i++) {
            const randomNumber = Math.floor(Math.random() * max);
            if (
                indices.filter((item) => item === randomNumber).length === 0 &&
                optionsWord[randomNumber].correctTranslation !== correctWord
            ) {
                indices.push(randomNumber);
            }
        }
        return indices;
    };

    const findLang = (word: Word, sourceWords: Word[]) => {
        if (
            sourceWords.find(
                (item) => item.correctTranslation === word.correctTranslation
            )
        ) {
            return word.word;
        }
        return word.correctTranslation;
    };

    const findLangWord = (
        correctWord: string,
        status: string,
        sourceWords: Word[],
        targetWords: Word[]
    ) => {
        if (sourceWords.find((item) => item.correctTranslation === correctWord)) {
            return status === StatusFind.OPTIONS ? sourceWords : StatusFind.SOURCE;
        }
        return status === StatusFind.OPTIONS ? targetWords : StatusFind.TARGET;
    };

    const createVariantsWord = (
        testWords: string,
        sourceWords: Word[],
        targetWords: Word[]
    ) => {
        const correctWord = testWords;
        const options = [correctWord];
        const optionsWord = findLangWord(
            correctWord,
            StatusFind.OPTIONS,
            sourceWords,
            targetWords
        );

        if (typeof optionsWord !== "string") {
            const indices = getRandom(optionsWord.length, optionsWord, correctWord);
            indices.forEach((el) => options.push(optionsWord[el].correctTranslation));

            return shuffle(options);
        }
    };

    const recreateWords = (
        testWords: Word[],
        sourceWords: Word[],
        targetWords: Word[]
    ) => {
        const selectWord = testWords[0];
        const selectLang = findLangWord(
            selectWord.word,
            StatusFind.LANG,
            sourceWords,
            targetWords
        );
        const addWords = [];

        const newWord = {
            id: selectWord.id,
            word: selectWord.correctTranslation,
            correctTranslation: selectWord.word,
            point: 0,
        };

        const newCorrectTranslation = {
            id: selectWord.id,
            word: selectWord.word,
            correctTranslation: selectWord.correctTranslation,
            point: 0,
        };

        if (selectLang === StatusFind.SOURCE) {
            addWords.push(newWord, newWord, newCorrectTranslation);
        } else {
            addWords.push(newCorrectTranslation, newWord, newCorrectTranslation);
        }

        const recreate = testWords.filter(
            (item: Word) =>
                item.word !== selectWord.word &&
                item.word !== selectWord.correctTranslation &&
                item.correctTranslation !== selectWord.correctTranslation &&
                item.correctTranslation !== selectWord.word
        );

        addWords.forEach((word: Word) => recreate.push(word));

        return shuffle(recreate) as Word[];
    };

    const setColor = (
        errorSelectWord: string,
        correctSelectWord: string,
        item: string
    ) => {
        if (correctSelectWord === item) {
            return ColorKeys.GREEN;
        } else if (errorSelectWord === item) {
            return ColorKeys.RED;
        } else {
            return "";
        }
    };

    const editPoint = (testWords: Word[], point: number, status: boolean) => {
        const selectWord = testWords[0];
        testWords.forEach((item: Word) => {
            if (
                item.word === selectWord.word ||
                item.word === selectWord.correctTranslation ||
                item.correctTranslation === selectWord.correctTranslation ||
                item.correctTranslation === selectWord.word
            ) {
                if (status) {
                    item.point = point + 1;
                } else {
                    item.point = 0;
                }
            }
        });
        return testWords;
    };

    const clearPoint = (testWords: Word[]) => {
        testWords.forEach((item) => {
            item.point = 0;
        });
        return testWords;
    };

    return {
        createVariantsWord,
        recreateWords,
        setColor,
        editPoint,
        clearPoint,
        findLang,
    };
};
