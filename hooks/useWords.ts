import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import { useState } from "react";
import { Enter } from "../Interfaces/EnterInterface";
import { Word } from "../Interfaces/ProvidersInterface";
import { ContextKey, NotificationKeys } from "../services/localKey";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";

export const useWords = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();

  const [wordsHook, setWordsHook] = useState([] as Word[]);

  const getWord = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWordsHook(docSnap.data().englishWords);
      } else {
        const db = getFirestore();
        const collectionId = "words";
        const documentId = authContext.user.uid;

        const value = {
          russianWords: [],
          englishWords: [],
          uid: authContext.user.uid,
        };
        setDoc(doc(db, collectionId, documentId), value);
        Router.push("/enter");
      }
    }
  };

  const updateWord = async (id: number, data: Enter) => {
    const newEnglishWord = {
      id: id,
      word: data.englishWord,
      correctTranslation: data.russianWord,
      point: 0,
    };
    const newRussianWord = {
      id: id,
      word: data.russianWord,
      correctTranslation: data.englishWord,
      point: 0,
    };

    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let arr = docSnap.data();
        const wordsEnglish = arr.englishWords as Word[];
        const wordsRussian = arr.russianWords as Word[];

        const keys = [ContextKey.ENGLISH, ContextKey.RUSSIAN];
        const repeatingWord = [] as string[];

        const findWords = (data: Enter, key: string) => {
          if (key === ContextKey.ENGLISH) {
            return wordsEnglish.find((item) => item.word === data.englishWord);
          }
          return wordsRussian.find((item) => item.word === data.russianWord);
        };

        keys.forEach((lang) => {
          if (findWords(data, lang)) {
            repeatingWord.push(lang);
          }
        });

        if (repeatingWord.length > 1) {
          addNotification("hasAlready", NotificationKeys.ERROR);
          return;
        } else {
          const indexEnglish = wordsEnglish
            .map((id: Word) => id.id)
            .indexOf(newEnglishWord.id);
          wordsEnglish[indexEnglish] = newEnglishWord;

          const indexRussian = wordsRussian
            .map((id: Word) => id.id)
            .indexOf(newRussianWord.id);
          wordsRussian[indexRussian] = newRussianWord;

          setDoc(docRef, arr);
          addNotification("wordEdit", NotificationKeys.SUCCESS);
          return;
        }
      }
    }
  };

  const deleteWord = async (id: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "words", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let arr = docSnap.data();
        const wordsEnglish = arr.englishWords as Word[];
        const wordsRussian = arr.russianWords as Word[];

        const indexEnglish = wordsEnglish.map((id: Word) => id.id).indexOf(id);

        wordsEnglish.splice(indexEnglish, 1);

        const indexRussian = wordsRussian.map((id: Word) => id.id).indexOf(id);

        wordsRussian.splice(indexRussian, 1);

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
        let arr = docSnap.data();
        const wordsEnglish = arr.englishWords as Word[];
        const wordsRussian = arr.russianWords as Word[];

        const keys = [ContextKey.ENGLISH, ContextKey.RUSSIAN];
        const repeatingWord = [] as string[];

        const findWords = (data: Enter, key: string) => {
          if (key === ContextKey.ENGLISH) {
            return wordsEnglish.find((item) => item.word === data.englishWord);
          }
          return wordsRussian.find((item) => item.word === data.russianWord);
        };

        keys.forEach((lang) => {
          if (findWords(data, lang)) {
            repeatingWord.push(lang);
          }
        });

        if (repeatingWord.length > 1) {
          addNotification("hasAlready", NotificationKeys.ERROR);
          return;
        } else {
          const newEnglishWord = {
            id: wordsEnglish.length,
            word: data.englishWord,
            correctTranslation: data.russianWord,
            point: 0,
          };
          const newRussianWord = {
            id: wordsRussian.length,
            word: data.russianWord,
            correctTranslation: data.englishWord,
            point: 0,
          };
          wordsEnglish.push(newEnglishWord);
          wordsRussian.push(newRussianWord);
          addNotification("wordAdd", NotificationKeys.SUCCESS);
          setDoc(docRef, arr);
          return;
        }
      } else {
        const db = getFirestore();
        const collectionId = "words";
        const documentId = authContext.user.uid;

        const newEnglishWord = {
          id: 1,
          word: data.englishWord,
          correctTranslation: data.russianWord,
          point: 0,
        };
        const newRussianWord = {
          id: 1,
          word: data.russianWord,
          correctTranslation: data.englishWord,
          point: 0,
        };

        const value = {
          russianWords: [newRussianWord],
          englishWords: [newEnglishWord],
          uid: authContext.user.uid,
        };
        setDoc(doc(db, collectionId, documentId), value);
        addNotification("wordAdd", NotificationKeys.SUCCESS);
      }
    }
  };
  return {
    updateWord,
    deleteWord,
    getWord,
    addWord,
    wordsHook,
  };
};
