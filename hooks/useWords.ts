import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import { useState } from "react";
import { Enter } from "../Interfaces/EnterInterface";
import { Word } from "../Interfaces/ProvidersInterface";
import { NotificationKeys } from "../services/localKey";
import { createEmptyWordsDoc } from "../utils/learningPair";
import {
  buildWordPair,
  ensureWordArrays,
  getWordArrays,
  isDuplicateOnEdit,
  isDuplicateWord,
} from "../utils/wordHelpers";
import { useAuth } from "./useAuth";
import { useLearningPair } from "./useLearningPair";
import { useNotification } from "./useNotification";

export const useWords = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { pairConfig } = useLearningPair();

  const [wordsHook, setWordsHook] = useState([] as Word[]);

  const getWord = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { sourceWords } = getWordArrays(docSnap.data(), pairConfig);
        setWordsHook(sourceWords);
      } else {
        setDoc(
          doc(db, "words", authContext.user.uid),
          createEmptyWordsDoc(authContext.user.uid)
        );
        Router.push("/enter");
      }
    }
  };

  const updateWord = async (id: number, data: Enter) => {
    const { sourceWord, targetWord } = buildWordPair(id, data);

    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
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

        setDoc(docRef, arr);
        addNotification("wordEdit", NotificationKeys.SUCCESS);
      }
    }
  };

  const deleteWord = async (id: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const arr = { ...docSnap.data() };
        const { sourceWords, targetWords } = getWordArrays(arr, pairConfig);

        sourceWords.splice(
          sourceWords.map((item) => item.id).indexOf(id),
          1
        );
        targetWords.splice(
          targetWords.map((item) => item.id).indexOf(id),
          1
        );

        arr[pairConfig.sourceKey] = sourceWords;
        arr[pairConfig.targetKey] = targetWords;

        setDoc(docRef, arr);
        addNotification("wordDelete", NotificationKeys.SUCCESS);
      }
    }
  };

  const addWord = async (data: Enter) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
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

        addNotification("wordAdd", NotificationKeys.SUCCESS);
        setDoc(docRef, arr);
      } else {
        const { sourceWord, targetWord } = buildWordPair(0, data);
        const value = createEmptyWordsDoc(authContext.user.uid);
        value[pairConfig.sourceKey] = [sourceWord] as never;
        value[pairConfig.targetKey] = [targetWord] as never;

        setDoc(doc(db, "words", authContext.user.uid), value);
        addNotification("wordAdd", NotificationKeys.SUCCESS);
      }
    }
  };

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      pairConfig.sourceLang === "es" ? "es-ES" : "en-US";
    speechSynthesis.speak(utterance);
  };

  return {
    updateWord,
    deleteWord,
    getWord,
    addWord,
    wordsHook,
    speakWord,
  };
};
