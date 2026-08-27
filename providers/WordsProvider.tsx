import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Enter } from "../Interfaces/EnterInterface";
import { Word, WordsProviderContextType } from "../Interfaces/ProvidersInterface";
import { NotificationKeys } from "../services/localKey";
import { WordsCacheService } from "../services/wordsCacheService";
import { createEmptyWordsDoc } from "../utils/learningPair";
import {
  buildWordPair,
  ensureWordArrays,
  getWordArrays,
  isDuplicateOnEdit,
  isDuplicateWord,
} from "../utils/wordHelpers";
import { useAuth } from "../hooks/useAuth";
import { useLearningPair } from "../hooks/useLearningPair";
import { useNotification } from "../hooks/useNotification";

export const WordsContext = React.createContext<WordsProviderContextType>({
  wordsHook: [],
  isLoading: false,
  isValidating: false,
  getWord: async () => {},
  addWord: async () => {},
  updateWord: async () => {},
  deleteWord: async () => {},
  speakWord: () => {},
  invalidateWords: () => {},
});

export const WordsProvider: React.FC = ({ children }) => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { learningPair, pairConfig } = useLearningPair();

  const [wordsHook, setWordsHook] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const syncCache = useCallback(
    (words: Word[]) => {
      if (!authContext.user?.uid) return;
      WordsCacheService.set(authContext.user.uid, pairConfig.pair, words);
      setWordsHook(words);
    },
    [authContext.user?.uid, pairConfig.pair]
  );

  const invalidateWords = useCallback(() => {
    if (!authContext.user?.uid) return;
    WordsCacheService.clear(authContext.user.uid, pairConfig.pair);
  }, [authContext.user?.uid, pairConfig.pair]);

  const getWord = useCallback(
    async (options?: { force?: boolean }) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const force = options?.force ?? false;
      const cached = WordsCacheService.get(uid, pairConfig.pair);

      if (cached && !force) {
        setWordsHook(cached.words);
        setIsLoading(false);

        if (WordsCacheService.isFresh(cached)) {
          return;
        }

        setIsValidating(true);
      } else if (!cached) {
        setIsLoading(true);
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "words", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { sourceWords } = getWordArrays(docSnap.data(), pairConfig);
          syncCache(sourceWords);
        } else {
          await setDoc(docRef, createEmptyWordsDoc(uid));
          syncCache([]);
          Router.push("/enter");
        }
      } finally {
        setIsLoading(false);
        setIsValidating(false);
      }
    },
    [authContext.user?.uid, pairConfig, syncCache]
  );

  const addWord = useCallback(
    async (data: Enter) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "words", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const arr = ensureWordArrays({ ...docSnap.data() }, pairConfig);
        const { sourceWords, targetWords } = getWordArrays(arr, pairConfig);

        if (isDuplicateWord(data, sourceWords, targetWords)) {
          addNotification("hasAlready", NotificationKeys.ERROR);
          return;
        }

        const newId = sourceWords.length;
        const { sourceWord, targetWord } = buildWordPair(newId, data);

        sourceWords.push(sourceWord);
        targetWords.push(targetWord);

        arr[pairConfig.sourceKey] = sourceWords;
        arr[pairConfig.targetKey] = targetWords;

        await setDoc(docRef, arr);
        syncCache(sourceWords);
        addNotification("wordAdd", NotificationKeys.SUCCESS);
      } else {
        const { sourceWord, targetWord } = buildWordPair(0, data);
        const value = createEmptyWordsDoc(uid);
        value[pairConfig.sourceKey] = [sourceWord] as never;
        value[pairConfig.targetKey] = [targetWord] as never;

        await setDoc(docRef, value);
        syncCache([sourceWord]);
        addNotification("wordAdd", NotificationKeys.SUCCESS);
      }
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const updateWord = useCallback(
    async (id: number, data: Enter) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const { sourceWord, targetWord } = buildWordPair(id, data);
      const db = getFirestore();
      const docRef = doc(db, "words", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const arr = ensureWordArrays({ ...docSnap.data() }, pairConfig);
      const { sourceWords, targetWords } = getWordArrays(arr, pairConfig);

      if (isDuplicateOnEdit(data, sourceWords, targetWords, id)) {
        addNotification("hasAlready", NotificationKeys.ERROR);
        return;
      }

      const indexSource = sourceWords.map((item) => item.id).indexOf(id);
      sourceWords[indexSource] = sourceWord;

      const indexTarget = targetWords.map((item) => item.id).indexOf(id);
      targetWords[indexTarget] = targetWord;

      arr[pairConfig.sourceKey] = sourceWords;
      arr[pairConfig.targetKey] = targetWords;

      await setDoc(docRef, arr);
      syncCache(sourceWords);
      addNotification("wordEdit", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const deleteWord = useCallback(
    async (id: number) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "words", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const arr = { ...docSnap.data() };
      const { sourceWords, targetWords } = getWordArrays(arr, pairConfig);

      sourceWords.splice(sourceWords.map((item) => item.id).indexOf(id), 1);
      targetWords.splice(targetWords.map((item) => item.id).indexOf(id), 1);

      arr[pairConfig.sourceKey] = sourceWords;
      arr[pairConfig.targetKey] = targetWords;

      await setDoc(docRef, arr);
      syncCache(sourceWords);
      addNotification("wordDelete", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const speakWord = useCallback(
    (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = pairConfig.sourceLang === "es" ? "es-ES" : "en-US";
      speechSynthesis.speak(utterance);
    },
    [pairConfig.sourceLang]
  );

  useEffect(() => {
    const uid = authContext.user?.uid;
    if (!uid) {
      setWordsHook([]);
      return;
    }

    const cached = WordsCacheService.get(uid, pairConfig.pair);
    if (cached) {
      setWordsHook(cached.words);
    }

    getWord();
  }, [authContext.user?.uid, learningPair]);

  const value = {
    wordsHook,
    isLoading,
    isValidating,
    getWord,
    addWord,
    updateWord,
    deleteWord,
    speakWord,
    invalidateWords,
  };

  return <WordsContext.Provider value={value}>{children}</WordsContext.Provider>;
};

export const useWordsContext = () => useContext(WordsContext);
