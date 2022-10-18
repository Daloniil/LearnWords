import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import Router from "next/router";
import { useState } from "react";
import { FoldersType, Word } from "../Interfaces/ProvidersInterface";
import { Enter } from "../Interfaces/EnterInterface";
import { ContextKey, NotificationKeys } from "../services/localKey";
import { useNotification } from "./useNotification";

export const useFolders = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();

  const [foldersHook, setFoldersHook] = useState([] as FoldersType[]);

  const createFolder = async (nameFolder: string) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const arr = docSnap.data().folders;
        const repeating = [];
        arr.forEach((folder: any) => {
          if (folder.name === nameFolder) {
            repeating.push(folder.name);
          }
        });
        if (repeating.length >= 1) {
          addNotification(`sameFolder`, NotificationKeys.ERROR);
        } else {
          const newFolder = {
            id: arr.length ? arr[arr.length - 1].id + 1 : 1,
            name: nameFolder,
            englishWords: [],
            russianWords: [],
          };
          arr.push(newFolder);

          setDoc(docRef, { folders: arr });
          addNotification("addFolder", NotificationKeys.SUCCESS);
          return;
        }
      }
    }
  };

  const getFolders = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFoldersHook(docSnap.data().folders);
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

  const deleteFolder = async (id: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let arr = docSnap.data().folders;

        const index = arr.map((id: FoldersType) => id.id).indexOf(id);

        arr.splice(index, 1);

        setDoc(docRef, { folders: arr });

        setTimeout(() => {
          getFolders();
        }, 500);
      }
    }
  };

  const addWords = async (data: Word[], id: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const folder = docSnap.data();
        let arr = folder.folders.find((idFol: any) => idFol.id === id);

        const wordsEnglish = arr.englishWords as Word[];
        const wordsRussian = arr.russianWords as Word[];

        let repeatingWord = "fThese words are already in the folder: ";

        const findWords = (data: Word) => {
          return wordsEnglish.find((item) => item.word === data.word);
        };

        data.forEach((word) => {
          if (findWords(word)) {
            repeatingWord = repeatingWord + ` ${word.word},`;
          }
        });

        if (repeatingWord.length > 40) {
          addNotification(`${repeatingWord}`, NotificationKeys.ERROR);
        } else {
          data.forEach((word) => {
            const newEnglishWord = {
              id: word.id,
              word: word.word,
              correctTranslation: word.correctTranslation,
              point: word.point,
            };
            const newRussianWord = {
              id: word.id,
              word: word.correctTranslation,
              correctTranslation: word.word,
              point: word.point,
            };
            wordsEnglish.push(newEnglishWord);
            wordsRussian.push(newRussianWord);
          });

          addNotification("wordAdd", NotificationKeys.SUCCESS);
          setDoc(docRef, folder);
          return;
        }
      }
    }
  };

  const deleteWords = async (idFolder: number, idWord: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const folder = docSnap.data();
        let arr = folder.folders.find((idFol: any) => idFol.id === idFolder);

        const wordsEnglish = arr.englishWords as Word[];
        const wordsRussian = arr.russianWords as Word[];

        const indexEnglish = wordsEnglish
          .map((id: Word) => id.id)
          .indexOf(idWord);

        wordsEnglish.splice(indexEnglish, 1);

        const indexRussian = wordsRussian
          .map((id: Word) => id.id)
          .indexOf(idWord);

        wordsRussian.splice(indexRussian, 1);

        setDoc(docRef, folder);
        addNotification("wordDelete", NotificationKeys.SUCCESS);
      }
    }
  };

  const updateWords = async (idFolder: number, idWord: number, data: Enter) => {
    const newEnglishWord = {
      id: idWord,
      word: data.englishWord,
      correctTranslation: data.russianWord,
      point: 0,
    };
    const newRussianWord = {
      id: idWord,
      word: data.russianWord,
      correctTranslation: data.englishWord,
      point: 0,
    };

    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const folder = docSnap.data();
        let arr = folder.folders.find((idFol: any) => idFol.id === idFolder);

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

          setDoc(docRef, folder);
          addNotification("wordEdit", NotificationKeys.SUCCESS);
          return;
        }
      }
    }
  };

  return {
    createFolder,
    getFolders,
    deleteFolder,
    foldersHook,
    addWords,
    deleteWords,
    updateWords,
  };
};
