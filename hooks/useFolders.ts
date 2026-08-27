import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import Router from "next/router";
import { useState } from "react";
import { FoldersType, Word } from "../Interfaces/ProvidersInterface";
import { Enter } from "../Interfaces/EnterInterface";
import { NotificationKeys } from "../services/localKey";
import {
  createEmptyFolder,
  createEmptyFoldersDoc,
  findFolderInDoc,
  foldersDocChanged,
  getFoldersFromDoc,
  normalizeFoldersDoc,
  persistFoldersDoc,
} from "../utils/learningPair";
import {
  buildWordPair,
  ensureWordArrays,
  getWordArrays,
  isDuplicateOnEdit,
} from "../utils/wordHelpers";
import { useLearningPair } from "./useLearningPair";
import { useNotification } from "./useNotification";

export const useFolders = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { pairConfig } = useLearningPair();

  const [foldersHook, setFoldersHook] = useState([] as FoldersType[]);

  const createFolder = async (nameFolder: string) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = normalizeFoldersDoc(docSnap.data());
        const arr = getFoldersFromDoc(data, pairConfig);
        const repeating = arr.some((folder) => folder.name === nameFolder);

        if (repeating) {
          addNotification(`sameFolder`, NotificationKeys.ERROR);
        } else {
          const newFolder = createEmptyFolder(
            arr.length ? arr[arr.length - 1].id + 1 : 1,
            nameFolder,
            pairConfig.pair
          );
          arr.push(newFolder);

          setDoc(docRef, persistFoldersDoc(data, pairConfig, arr));
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
        const raw = docSnap.data();
        const data = normalizeFoldersDoc(raw);
        const folders = getFoldersFromDoc(data, pairConfig);
        setFoldersHook(folders);

        if (foldersDocChanged(raw, data)) {
          setDoc(docRef, data);
        }
      } else {
        setDoc(doc(db, "folders", authContext.user.uid), createEmptyFoldersDoc(authContext.user.uid));
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
        const data = normalizeFoldersDoc(docSnap.data());
        const arr = getFoldersFromDoc(data, pairConfig);
        const index = arr.map((item) => item.id).indexOf(id);

        arr.splice(index, 1);

        setDoc(docRef, persistFoldersDoc(data, pairConfig, arr));
        addNotification("folderDelete", NotificationKeys.SUCCESS);
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
        const folder = normalizeFoldersDoc(docSnap.data());
        const folderItem = findFolderInDoc(folder, id, pairConfig);

        if (!folderItem) return;

        ensureWordArrays(folderItem, pairConfig);
        const { sourceWords, targetWords } = getWordArrays(
          folderItem,
          pairConfig
        );

        let repeatingWord = "These words are already in the folder: ";

        data.forEach((word) => {
          if (sourceWords.find((item) => item.word === word.word)) {
            repeatingWord = repeatingWord + ` ${word.word},`;
          }
        });

        if (repeatingWord.length > 39) {
          addNotification(`${repeatingWord}`, NotificationKeys.ERROR);
        } else {
          data.forEach((word) => {
            const { sourceWord, targetWord } = buildWordPair(word.id, {
              sourceWord: word.word,
              targetWord: word.correctTranslation,
            });
            sourceWord.point = word.point;
            targetWord.point = word.point;
            sourceWords.push(sourceWord);
            targetWords.push(targetWord);
          });

          folderItem[pairConfig.sourceKey] = sourceWords;
          folderItem[pairConfig.targetKey] = targetWords;

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
        const folder = normalizeFoldersDoc(docSnap.data());
        const folderItem = findFolderInDoc(folder, idFolder, pairConfig);

        if (!folderItem) return;

        const { sourceWords, targetWords } = getWordArrays(
          folderItem,
          pairConfig
        );

        sourceWords.splice(
          sourceWords.map((item) => item.id).indexOf(idWord),
          1
        );
        targetWords.splice(
          targetWords.map((item) => item.id).indexOf(idWord),
          1
        );

        folderItem[pairConfig.sourceKey] = sourceWords;
        folderItem[pairConfig.targetKey] = targetWords;

        setDoc(docRef, folder);
        addNotification("wordDelete", NotificationKeys.SUCCESS);
      }
    }
  };

  const updateWords = async (idFolder: number, idWord: number, data: Enter) => {
    const { sourceWord, targetWord } = buildWordPair(idWord, data);

    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const folder = normalizeFoldersDoc(docSnap.data());
        const folderItem = findFolderInDoc(folder, idFolder, pairConfig);

        if (!folderItem) return;

        ensureWordArrays(folderItem, pairConfig);
        const { sourceWords, targetWords } = getWordArrays(
          folderItem,
          pairConfig
        );

        if (isDuplicateOnEdit(data, sourceWords, targetWords, idWord)) {
          addNotification("hasAlready", NotificationKeys.ERROR);
          return;
        }

        sourceWords[
          sourceWords.map((item) => item.id).indexOf(sourceWord.id)
        ] = sourceWord;
        targetWords[
          targetWords.map((item) => item.id).indexOf(targetWord.id)
        ] = targetWord;

        folderItem[pairConfig.sourceKey] = sourceWords;
        folderItem[pairConfig.targetKey] = targetWords;

        setDoc(docRef, folder);
        addNotification("wordEdit", NotificationKeys.SUCCESS);
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
