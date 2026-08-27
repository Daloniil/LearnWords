import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Enter } from "../Interfaces/EnterInterface";
import {
  FoldersProviderContextType,
  FoldersType,
  Word,
} from "../Interfaces/ProvidersInterface";
import { NotificationKeys } from "../services/localKey";
import { FoldersCacheService } from "../services/foldersCacheService";
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
import { useAuth } from "../hooks/useAuth";
import { useLearningPair } from "../hooks/useLearningPair";
import { useNotification } from "../hooks/useNotification";

export const FoldersContext = React.createContext<FoldersProviderContextType>({
  foldersHook: [],
  isLoading: false,
  isValidating: false,
  getFolders: async () => {},
  createFolder: async () => {},
  deleteFolder: async () => {},
  addWords: async () => {},
  deleteWords: async () => {},
  updateWords: async () => {},
  invalidateFolders: () => {},
});

export const FoldersProvider: React.FC = ({ children }) => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { learningPair, pairConfig } = useLearningPair();

  const [foldersHook, setFoldersHook] = useState<FoldersType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const syncCache = useCallback(
    (folders: FoldersType[]) => {
      if (!authContext.user?.uid) return;
      FoldersCacheService.set(authContext.user.uid, pairConfig.pair, folders);
      setFoldersHook(folders);
    },
    [authContext.user?.uid, pairConfig.pair]
  );

  const invalidateFolders = useCallback(() => {
    if (!authContext.user?.uid) return;
    FoldersCacheService.clear(authContext.user.uid, pairConfig.pair);
  }, [authContext.user?.uid, pairConfig.pair]);

  const getFolders = useCallback(
    async (options?: { force?: boolean }) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const force = options?.force ?? false;
      const cached = FoldersCacheService.get(uid, pairConfig.pair);

      if (cached && !force) {
        setFoldersHook(cached.folders);
        setIsLoading(false);

        if (FoldersCacheService.isFresh(cached)) {
          return;
        }

        setIsValidating(true);
      } else if (!cached) {
        setIsLoading(true);
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "folders", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const raw = docSnap.data();
          const data = normalizeFoldersDoc(raw);
          const folders = getFoldersFromDoc(data, pairConfig);
          syncCache(folders);

          if (foldersDocChanged(raw, data)) {
            await setDoc(docRef, data);
          }
        } else {
          await setDoc(docRef, createEmptyFoldersDoc(uid));
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

  const createFolder = useCallback(
    async (nameFolder: string) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "folders", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const data = normalizeFoldersDoc(docSnap.data());
      const arr = getFoldersFromDoc(data, pairConfig);
      const repeating = arr.some((folder) => folder.name === nameFolder);

      if (repeating) {
        addNotification("sameFolder", NotificationKeys.ERROR);
        return;
      }

      const newFolder = createEmptyFolder(
        arr.length ? arr[arr.length - 1].id + 1 : 1,
        nameFolder,
        pairConfig.pair
      );
      arr.push(newFolder);

      await setDoc(docRef, persistFoldersDoc(data, pairConfig, arr));
      syncCache(arr);
      addNotification("addFolder", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const deleteFolder = useCallback(
    async (id: number) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "folders", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const data = normalizeFoldersDoc(docSnap.data());
      const arr = getFoldersFromDoc(data, pairConfig);
      const index = arr.map((item) => item.id).indexOf(id);

      if (index === -1) return;

      arr.splice(index, 1);

      await setDoc(docRef, persistFoldersDoc(data, pairConfig, arr));
      syncCache(arr);
      addNotification("folderDelete", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const addWords = useCallback(
    async (words: Word[], id: number) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "folders", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const folderDoc = normalizeFoldersDoc(docSnap.data());
      const folderItem = findFolderInDoc(folderDoc, id, pairConfig);

      if (!folderItem) return;

      ensureWordArrays(folderItem, pairConfig);
      const { sourceWords, targetWords } = getWordArrays(folderItem, pairConfig);

      let repeatingWord = "These words are already in the folder: ";

      words.forEach((word) => {
        if (sourceWords.find((item) => item.word === word.word)) {
          repeatingWord = repeatingWord + ` ${word.word},`;
        }
      });

      if (repeatingWord.length > 39) {
        addNotification(`${repeatingWord}`, NotificationKeys.ERROR);
        return;
      }

      words.forEach((word) => {
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

      await setDoc(docRef, folderDoc);
      syncCache(getFoldersFromDoc(folderDoc, pairConfig));
      addNotification("wordAdd", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const deleteWords = useCallback(
    async (idFolder: number, idWord: number) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const db = getFirestore();
      const docRef = doc(db, "folders", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const folderDoc = normalizeFoldersDoc(docSnap.data());
      const folderItem = findFolderInDoc(folderDoc, idFolder, pairConfig);

      if (!folderItem) return;

      const { sourceWords, targetWords } = getWordArrays(folderItem, pairConfig);

      sourceWords.splice(sourceWords.map((item) => item.id).indexOf(idWord), 1);
      targetWords.splice(targetWords.map((item) => item.id).indexOf(idWord), 1);

      folderItem[pairConfig.sourceKey] = sourceWords;
      folderItem[pairConfig.targetKey] = targetWords;

      await setDoc(docRef, folderDoc);
      syncCache(getFoldersFromDoc(folderDoc, pairConfig));
      addNotification("wordDelete", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  const updateWords = useCallback(
    async (idFolder: number, idWord: number, data: Enter) => {
      const uid = authContext.user?.uid;
      if (!uid) return;

      const { sourceWord, targetWord } = buildWordPair(idWord, data);
      const db = getFirestore();
      const docRef = doc(db, "folders", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const folderDoc = normalizeFoldersDoc(docSnap.data());
      const folderItem = findFolderInDoc(folderDoc, idFolder, pairConfig);

      if (!folderItem) return;

      ensureWordArrays(folderItem, pairConfig);
      const { sourceWords, targetWords } = getWordArrays(folderItem, pairConfig);

      if (isDuplicateOnEdit(data, sourceWords, targetWords, idWord)) {
        addNotification("hasAlready", NotificationKeys.ERROR);
        return;
      }

      sourceWords[sourceWords.map((item) => item.id).indexOf(sourceWord.id)] =
        sourceWord;
      targetWords[targetWords.map((item) => item.id).indexOf(targetWord.id)] =
        targetWord;

      folderItem[pairConfig.sourceKey] = sourceWords;
      folderItem[pairConfig.targetKey] = targetWords;

      await setDoc(docRef, folderDoc);
      syncCache(getFoldersFromDoc(folderDoc, pairConfig));
      addNotification("wordEdit", NotificationKeys.SUCCESS);
    },
    [authContext.user?.uid, pairConfig, addNotification, syncCache]
  );

  useEffect(() => {
    const uid = authContext.user?.uid;
    if (!uid) {
      setFoldersHook([]);
      return;
    }

    const cached = FoldersCacheService.get(uid, pairConfig.pair);
    if (cached) {
      setFoldersHook(cached.folders);
    }

    getFolders();
  }, [authContext.user?.uid, learningPair]);

  const value = {
    foldersHook,
    isLoading,
    isValidating,
    getFolders,
    createFolder,
    deleteFolder,
    addWords,
    deleteWords,
    updateWords,
    invalidateFolders,
  };

  return (
    <FoldersContext.Provider value={value}>{children}</FoldersContext.Provider>
  );
};

export const useFoldersContext = () => useContext(FoldersContext);
