import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import { useState } from "react";
import { Word, WordsContextType } from "../Interfaces/ProvidersInterface";
import { NotificationKeys } from "../services/localKey";
import { findFolderInDoc, normalizeFoldersDoc } from "../utils/learningPair";
import { mapFolderToWordsContext } from "../utils/wordHelpers";
import { useAuth } from "./useAuth";
import { useLearningPair } from "./useLearningPair";
import { useNotification } from "./useNotification";

export const useTestContext = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();
  const { pairConfig } = useLearningPair();

  const [allWordsHook, setAllWordsHook] = useState<WordsContextType>({
    sourceWords: [],
    targetWords: [],
  });
  const [testWordHook, setTestWordHook] = useState([] as Word[]);
  const [percentHook, setPercentHook] = useState(0);
  const [selectFolderStatus, setSelectFolderStatus] = useState(false);

  const setWordsFromFolder = (folder: Record<string, unknown>) => {
    setAllWordsHook(mapFolderToWordsContext(folder, pairConfig));
  };

  const getTest = async (folderId?: number) => {
    if (authContext.user) {
      const db = getFirestore();

      const docRefFolder = doc(db, "folders", authContext.user.uid);
      const docSnapFolder = await getDoc(docRefFolder);

      const docRefTest = doc(db, "test", authContext.user.uid);
      const docSnapTest = await getDoc(docRefTest);

      if (docSnapTest.exists()) {
        const testData = docSnapTest.data();
        const savedPair = testData.learningPair ?? "en-ru";

        if (savedPair !== pairConfig.pair) {
          deleteTestServer();
          setSelectFolderStatus(true);
          return;
        }

        setTestWordHook(testData.testWordsContext);
        if (!testData.testWordsContext.length) {
          setSelectFolderStatus(true);
        } else {
          if (docSnapFolder.exists()) {
            const folder = normalizeFoldersDoc(docSnapFolder.data());
            const arr = findFolderInDoc(
              folder,
              testData.folderId,
              pairConfig
            );
            if (arr) {
              setWordsFromFolder(arr);
            } else {
              deleteTestServer();
              Router.push("/enter");
              addNotification("notFoundTest", NotificationKeys.ERROR);
            }
          }
        }
      }

      if (docSnapFolder.exists() && folderId) {
        const folder = normalizeFoldersDoc(docSnapFolder.data());
        const arr = findFolderInDoc(folder, folderId, pairConfig);
        if (arr) {
          setWordsFromFolder(arr);
        }
      }
      if (!docSnapTest.exists()) {
        const value = {
          percentTestContext: 0,
          testWordsContext: [],
          uid: authContext.user.uid,
          folderId: null,
          learningPair: pairConfig.pair,
        };
        setDoc(doc(db, "test", authContext.user.uid), value);
        addNotification("leastFive", NotificationKeys.ERROR);
        Router.push("/enter");
      }
    }
  };

  const setTestWordsServer = async (testWords: Word[], folderId?: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "test", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        data.testWordsContext = testWords;
        data.learningPair = pairConfig.pair;
        if (folderId) {
          data.folderId = folderId;
        }
        setDoc(docRef, data);
      }
    }
  };

  const setPercentServer = async (percent: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "test", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        data.percentTestContext = percent;
        setPercentHook(percent);
        setDoc(docRef, data);
      }
    }
  };

  const getPercentServer = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "test", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPercentHook(docSnap.data().percentTestContext);
      }
    }
  };

  const deleteTestServer = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "test", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        data.testWordsContext = [];
        data.percentTestContext = 0;
        data.folderId = null;
        data.learningPair = pairConfig.pair;
        setDoc(docRef, data);
      }
    }
  };

  return {
    getTest,
    testWordHook,
    allWordsHook,
    setTestWordsServer,
    setPercentServer,
    getPercentServer,
    percentHook,
    deleteTestServer,
    selectFolderStatus,
  };
};
