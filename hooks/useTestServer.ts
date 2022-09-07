import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import { useState } from "react";
import { Word, WordsContextType } from "../Interfaces/ProvidersInterface";
import { NotificationKeys } from "../services/localKey";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";

export const useTestContext = () => {
  const { authContext } = useAuth();
  const { addNotification } = useNotification();

  const [allWordsHook, setAllWordsHook] = useState({} as WordsContextType);
  const [testWordHook, setTestWordHook] = useState([] as Word[]);
  const [percentHook, setPercentHook] = useState(0);

  const getTest = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRefWords = doc(db, "words", authContext.user.uid);
      const docSnapWords = await getDoc(docRefWords);

      const docRefTest = doc(db, "test", authContext.user.uid);
      const docSnapTest = await getDoc(docRefTest);

      if (docSnapTest.exists()) {
        setTestWordHook(docSnapTest.data().testWordsContext);
      }

      if (docSnapWords.exists()) {
        //@ts-ignore
        setAllWordsHook(docSnapWords.data());
      }

      if (!docSnapTest.exists()) {
        const db = getFirestore();
        const collectionId = "test";
        const documentId = authContext.user.uid;

        const value = {
          percentTestContext: 0,
          testWordsContext: [],
          uid: authContext.user.uid,
        };

        setDoc(doc(db, collectionId, documentId), value);
        addNotification("leastFive", NotificationKeys.ERROR);
        Router.push("/enter");
      }
    }
  };

  const setTestWordsServer = async (testWords: Word[]) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "test", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();
        data.testWordsContext = testWords;
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
        let data = docSnap.data();
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
        let data = docSnap.data();
        data.testWordsContext = [];
        data.percentTestContext = 0;
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
  };
};
