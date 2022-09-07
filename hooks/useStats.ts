import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Router from "next/router";
import { useState } from "react";
import { Stats } from "../Interfaces/ProvidersInterface";
import { useAuth } from "./useAuth";

export const useStats = () => {
  const { authContext } = useAuth();

  const [statsHook, setStatsHook] = useState(null as null | Stats[]);

  const addStatsServer = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "stats", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const idNewStats =
          data.stats.length > 0 ? data.stats[data.stats.length - 1].id + 1 : 0;
        data.stats.push({ id: idNewStats, stat: [] });
        setDoc(docRef, data);
      }
    }
  };

  const addWordStatsServer = async (word: string, translation: string) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "stats", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.stats.length > 0) {
          data.stats[data.stats.length - 1].stat.push({
            word: word,
            translation: translation,
          });
        } else {
          data.stats.push({ id: 0, stat: [] });
        }
        setDoc(docRef, data);
      }
    }
  };

  const getStats = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "stats", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let stats = docSnap.data().stats;
        //@ts-ignore
        setStatsHook(stats);
      } else {
        const db = getFirestore();
        const collectionId = "stats";
        const documentId = authContext.user.uid;
        const value = {
          stats: [],
        };
        setDoc(doc(db, collectionId, documentId), value);
        Router.push("/enter");
      }
    }
  };

  const deleteStats = async (value: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "stats", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const stats = data.stats as Stats[];

        const index = stats.map((id) => id.id).indexOf(value);

        stats.splice(index, 1);
        stats.map((id, index) =>
          id.id > value ? (stats[index].id = id.id - 1) : ""
        );
        setDoc(docRef, data);
        setStatsHook(stats);
      }
    }
  };
  return {
    addStatsServer,
    addWordStatsServer,
    getStats,
    statsHook,
    deleteStats,
  };
};
